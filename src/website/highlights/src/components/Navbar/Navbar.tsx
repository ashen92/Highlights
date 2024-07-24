import {
    UnstyledButton,
    Text,
    Group,
    ActionIcon,
    Tooltip,
    rem,
    Space,
} from '@mantine/core';
import { IconBulb, IconUser, IconCheckbox, IconPlus, IconChartDots2, IconCalendarMonth , IconBellRinging,IconTie,IconAlarm} from '@tabler/icons-react';
import classes from './Navbar.module.css';
import Link from 'next/link';
import { useState } from 'react';

const links = [
    { icon: IconBulb, label: 'Highlights', path: '/highlights' },
    { icon: IconCheckbox, label: 'Tasks', path: '/tasks' },
    { icon: IconCalendarMonth, label: 'Calendar', path: '/calendar' },
    { icon: IconAlarm, label: 'Focus', path: '/focus' },
    { icon: IconChartDots2, label: 'Analytics', path: '/analytics' },
    { icon: IconUser, label: 'Profile', path: '/profile' },
    { icon: IconTie, label: 'Dailytips', path: '/dailytips' },
    // { icon: IconBellRinging, label: 'Notification', path: '/notification' },
    
];

const collections = [
    { emoji: '👍', label: 'Sales' },
    { emoji: '🚚', label: 'Deliveries' },
    { emoji: '💸', label: 'Discounts' },
    { emoji: '💰', label: 'Profits' },
    { emoji: '✨', label: 'Reports' },
    { emoji: '🛒', label: 'Orders' },
    { emoji: '📅', label: 'Events' },
    { emoji: '🙈', label: 'Debts' },
    { emoji: '💁‍♀️', label: 'Customers' },
];

export default function Navbar() {
    const [active, setActive] = useState('Billing');

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

    const collectionLinks = collections.map((collection) => (
        <a
            href="#"
            onClick={(event) => event.preventDefault()}
            key={collection.label}
            className={classes.collectionLink}
        >
            <span style={{ marginRight: rem(9), fontSize: rem(16) }}>{collection.emoji}</span>{' '}
            {collection.label}
        </a>
    ));

    return (
        <nav className={classes.navbar}>
            <Space h={'md'} />
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
                <div className={classes.collections}>{collectionLinks}</div>
            </div>
        </nav>
    );
}