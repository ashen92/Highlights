import {
    UnstyledButton,
    Text,
    Group,
    rem,
    Space,
    Avatar,
    Box,
} from '@mantine/core';
import { IconBulb, IconCheckbox, IconChartDots2, IconCalendarMonth, IconTie, IconAlarm, IconBellRinging, IconChevronRight, IconUser } from '@tabler/icons-react';
import classes from './Navbar.module.css';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import LinkServiceButton from './LinkServiceButton';
import WebSocketComponent from '@/components/RemainderNotification/RemainderNotification';
import { LinkedAccount } from '@/features/auth';
import MSToDoList from './List/MSToDoList';
import GTaskList from './List/GTaskList';
import UserMenu from '@/features/account/components/UserMenu';
import { useAppContext } from '@/features/account/AppContext';

const links = [
    { icon: IconBulb, label: 'Highlights', path: '/highlights' },
    { icon: IconCalendarMonth, label: 'Calendar', path: '/calendar' },
    { icon: IconAlarm, label: 'Focus', path: '/focus' },
    { icon: IconChartDots2, label: 'Analytics', path: '/analytics' },
    { icon: IconTie, label: 'Dailytips', path: '/dailytips' },
    { icon: IconBellRinging, label: 'Projects', path: '/projects' },
    { icon: IconBellRinging, label: 'Assigned to me', path: '/assigned' },
];

export default function Navbar() {
    const router = useRouter();
    const [active, setActive] = useState('Highlights');

    const { user } = useAppContext();

    useEffect(() => {
        const currentPath = router.pathname;
        const currentSection = links.find(item => item.path === currentPath);
        if (currentSection) {
            setActive(currentSection.label);
        }
    }, [router.pathname, router.asPath]);

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
                <Space mt={{ base: 'xs', sm: 'lg' }} h={'md'} />
                <Box visibleFrom='sm'>
                    <UserMenu position={'right'}>
                        <UnstyledButton className={classes.userMenu}>
                            <Group>
                                <Avatar
                                    src={user.photo ? `data:image/jpeg;base64,${user.photo}` : undefined}
                                    radius="xl"
                                >
                                    <IconUser size="1.5rem" />
                                </Avatar>
                                <Box style={{ flex: 1 }}>
                                    <Text size="sm" fw={500}>{user.displayName}</Text>
                                </Box>
                                <IconChevronRight style={{ width: rem(14), height: rem(14), marginLeft: 'auto' }} stroke={1.5} />
                            </Group>
                        </UnstyledButton>
                    </UserMenu>
                </Box>
                <Space h={'lg'} />
                <div className={classes.section}>
                    <div className={classes.mainLinks}>{mainLinks}</div>
                </div>

                {user.linkedAccounts.find(account => account.name === LinkedAccount.Microsoft) ? (
                    <MSToDoList active={active} setActive={setActive} />
                ) :
                    <LinkServiceButton service={LinkedAccount.Microsoft} />
                }

                {user.linkedAccounts.find(account => account.name === LinkedAccount.Google) ? (
                    <GTaskList active={active} setActive={setActive} />
                ) :
                    <LinkServiceButton service={LinkedAccount.Google} />
                }
            </nav >
        </>
    );
}