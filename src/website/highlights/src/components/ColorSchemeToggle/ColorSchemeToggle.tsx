import cx from 'clsx';
import { ActionIcon, useMantineColorScheme, useComputedColorScheme, Group } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import classes from './ColorSchemeToggle.module.css';

export default function ColorSchemeToggle({ className }: { className?: string }) {
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    return (
        <ActionIcon
            onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
            variant="default"
            size="xl"
            aria-label="Toggle color scheme"
            className={className}
        >
            <IconSun size={'md'} className={cx(classes.icon, classes.light)} stroke={1.5} />
            <IconMoon size={'md'} className={cx(classes.icon, classes.dark)} stroke={1.5} />
        </ActionIcon>
    );
}