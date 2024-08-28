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
    Loader,
} from '@mantine/core';
import { IconBulb, IconCheckbox, IconPlus, IconChartDots2, IconCalendarMonth, IconTie, IconAlarm, IconList, IconBellRinging, IconChevronRight } from '@tabler/icons-react';
import classes from './Navbar.module.css';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchMSToDoLists, selectListById, selectListIdsBySource } from '@/features/taskLists/taskListsSlice';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { AppUserLinkedAccount, useAppUser } from '@/hooks/useAppUser';
import UserMenu from '../UserMenu/UserMenu';
import { TaskListSource } from '@/features/taskLists/TaskListSource';
import LinkServiceButton from './LinkServiceButton';
import WebSocketComponent from '@/components/RemainderNotification/RemainderNotification';

const links = [
    { icon: IconBulb, label: 'Highlights', path: '/highlights' },
    { icon: IconCheckbox, label: 'Tasks', path: '/tasks' },
    { icon: IconCalendarMonth, label: 'Calendar', path: '/calendar' },
    { icon: IconAlarm, label: 'Focus', path: '/focus' },
    { icon: IconChartDots2, label: 'Analytics', path: '/analytics' },
    { icon: IconTie, label: 'Dailytips', path: '/dailytips' },
    { icon: IconBellRinging, label: 'Projects', path: '/projects' },
];

let TaskListExcerpt = ({ taskListId, active, setActive }: { taskListId: string, active: string, setActive: (label: string) => void }) => {
    const taskList = useAppSelector(state => selectListById(state, taskListId));
    return (
        <UnstyledButton
            component={Link}
            href={`/tasks/${taskList.id}`}
            key={taskList.id}
            className={classes.collectionLink}
            data-active={taskList.id === active || undefined}
            onClick={() => {
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

    const msToDoListIds = useAppSelector(state => selectListIdsBySource(state, TaskListSource.MicrosoftToDo));
    const msToDoLoadingStatus = useAppSelector(state => state.taskLists.status[TaskListSource.MicrosoftToDo]);
    const msToDoError = useAppSelector(state => state.taskLists.error[TaskListSource.MicrosoftToDo]);

    const gTaskListIds = useAppSelector(state => selectListIdsBySource(state, TaskListSource.GoogleTasks));

    const { user } = useAppUser();

    useEffect(() => {
        if (!user) return;
        if (user.linkedAccounts?.includes(AppUserLinkedAccount.Microsoft))
            dispatch(fetchMSToDoLists());
    }, [dispatch, user]);

    useEffect(() => {
        const currentPath = router.pathname;
        const currentSection = links.find(item => item.path === currentPath);
        if (currentSection) {
            setActive(currentSection.label);
        } else {
            const currentTaskList = msToDoListIds.find(item => `/tasks/${item}` === router.asPath)
                || gTaskListIds.find(item => `/tasks/${item}` === router.asPath);
            if (currentTaskList) {
                setActive(currentTaskList);
            }
        }
    }, [router.pathname, router.asPath, msToDoListIds, gTaskListIds]);

    const mainLinks = useMemo(() => links.map((link) => (
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
    )), [active]);

    return (
        <>
            <WebSocketComponent />
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

                {user?.linkedAccounts?.includes(AppUserLinkedAccount.Microsoft) ? (
                    <Box className={classes.section}>
                        <Group className={classes.collectionsHeader} justify="space-between">
                            <Text size="sm" fw={500} c="dimmed">
                                Microsoft To Do
                            </Text>
                            <Tooltip label="Create collection" withArrow position="right">
                                <ActionIcon variant="default" size={18}>
                                    <IconPlus style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                        {msToDoLoadingStatus === 'loading' ? (
                            <Box ta="center" py="md">
                                <Loader size="sm" />
                            </Box>
                        ) : msToDoLoadingStatus === 'failed' ? (
                            <Text c="red" size="sm" ta="center" py="md">
                                {msToDoError || 'Failed to load Microsoft To Do lists'}
                            </Text>
                        ) : (
                            <div className={classes.collections}>
                                {msToDoListIds.map((taskListId: string) => (
                                    <TaskListExcerpt key={taskListId} taskListId={taskListId} active={active} setActive={setActive} />
                                ))}
                            </div>
                        )}
                    </Box>
                ) :
                    <LinkServiceButton service="Microsoft" />
                }

                {user?.linkedAccounts?.includes(AppUserLinkedAccount.Google) ? (
                    <div className={classes.section}>
                        <Group className={classes.collectionsHeader} justify="space-between">
                            <Text size="sm" fw={500} c="dimmed">
                                Google Tasks
                            </Text>
                            <Tooltip label="Create collection" withArrow position="right">
                                <ActionIcon variant="default" size={18}>
                                    <IconPlus style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                        <div className={classes.collections}>
                            {gTaskListIds.map((taskListId: string) => (
                                <TaskListExcerpt key={taskListId} taskListId={taskListId} active={active} setActive={setActive} />
                            ))}
                        </div>
                    </div>
                ) :
                    <LinkServiceButton service="Google" />
                }
            </nav>
        </>
    );
}