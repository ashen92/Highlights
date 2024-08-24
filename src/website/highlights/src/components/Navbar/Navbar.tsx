import {
    UnstyledButton,
    Text,
    Group,
    ActionIcon,
    Tooltip,
    rem,
    Space,
    Avatar,
    Box,
} from '@mantine/core';
import { IconBulb, IconUser, IconCheckbox, IconPlus, IconChartDots2, IconCalendarMonth, IconTie, IconAlarm, IconList, IconBellRinging, IconChevronRight } from '@tabler/icons-react';
import classes from './Navbar.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchTaskLists, selectTaskListById, selectUserTaskListIds } from '@/features/taskLists/taskListsSlice';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { useAppUser } from '@/hooks/useAppUser';
import UserMenu from '../UserMenu/UserMenu';

const links = [
    { icon: IconBulb, label: 'Highlights', path: '/highlights' },
    { icon: IconCheckbox, label: 'Tasks', path: '/tasks' },
    { icon: IconCalendarMonth, label: 'Calendar', path: '/calendar' },
    { icon: IconAlarm, label: 'Focus', path: '/focus' },
    { icon: IconChartDots2, label: 'Analytics', path: '/analytics' },
    { icon: IconUser, label: 'Profile', path: '/profile' },
    { icon: IconTie, label: 'Dailytips', path: '/dailytips' },
    { icon: IconBellRinging, label: 'Projects', path: '/projects' },
];

let taskListIds: string[] = [];

let TaskListExcerpt = ({ taskListId, active, setActive }: { taskListId: string, active: string, setActive: (label: string) => void }) => {
    const taskList = useAppSelector(state => selectTaskListById(state, taskListId))
    taskListIds.push(taskList.id);
    return (
        <UnstyledButton
            component={Link}
            href={`/tasks/${taskList.id}`}
            key={taskList.id}
            className={classes.mainLink}
            data-active={taskList.id === active || undefined}
            onClick={(e) => {
                setActive(taskList.id);
            }}>
            <div className={classes.mainLinkInner}>
                <IconList size={20} className={classes.mainLinkIcon} />
                <span>{taskList.title}</span>
            </div>
        </UnstyledButton>
    );
}

export default function Navbar() {
    const router = useRouter();
    const [active, setActive] = useState('Highlights');

    const dispatch = useAppDispatch();

    const taskListIds = useAppSelector(selectUserTaskListIds);
    const { user } = useAppUser();

    useEffect(() => {
        dispatch(fetchTaskLists(user));
    }, [dispatch, user]);

    useEffect(() => {
        const currentPath = router.pathname;
        const currentSection = links.find(item => item.path === currentPath);
        if (currentSection) {
            setActive(currentSection.label);
        } else {
            const currentTaskList = taskListIds.find(item => `/tasks/${item}` === router.asPath);
            if (currentTaskList) {
                setActive(currentTaskList);
            }
        }
    }, [router.pathname, router.asPath, taskListIds]);

    const mainLinks = links.map((link) => (
        <UnstyledButton
            component={Link}
            href={link.path}
            key={link.label}
            className={classes.mainLink}
            data-active={link.label === active || undefined}
            onClick={(e) => {
                setActive(link.label);
            }}>
            <div className={classes.mainLinkInner}>
                <link.icon size={20} className={classes.mainLinkIcon} stroke={1.5} />
                <span>{link.label}</span>
            </div>
        </UnstyledButton >
    ));

    return (
        <nav className={classes.navbar}>
            <Space mt={{ base: 'xs', sm: 'xl' }} h={'md'} />
            <Box visibleFrom='sm'>
                <UserMenu position={'right'}>
                    <UnstyledButton className={classes.userMenu}>
                        <Group>
                            <Avatar
                                src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
                                radius="xl"
                            />
                            <Box style={{ flex: 1 }}>
                                <Text size="sm" fw={500}>Nancy Eggshacker</Text>

                                <Text c="dimmed" size="xs">
                                    neggshaker@mantine.dev
                                </Text>
                            </Box>
                            <IconChevronRight style={{ width: rem(14), height: rem(14), marginLeft: 'auto' }} stroke={1.5} />
                        </Group>
                    </UnstyledButton>
                </UserMenu>
            </Box>
            <Space h={'sm'} />
            <div className={classes.section}>
                <div className={classes.mainLinks}>{mainLinks}</div>
            </div>

            <div className={classes.section}>
                <Group className={classes.collectionsHeader} justify="space-between">
                    <Text size="sm" fw={500} c="dimmed">
                        Collections
                    </Text>
                    <Tooltip label="Create collection" withArrow position="right">
                        <ActionIcon variant="default" size={18}>
                            <IconPlus style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                        </ActionIcon>
                    </Tooltip>
                </Group>
                <div className={classes.collections}>
                    {taskListIds.map((taskListId: string) => (
                        <TaskListExcerpt key={taskListId} taskListId={taskListId} active={active} setActive={setActive} />
                    ))}
                </div>
            </div>
        </nav>
    );
}