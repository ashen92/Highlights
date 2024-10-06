import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Navbar from '../Navbar/Navbar';
import Header from '../Header/Header';
import classes from './PageLayout.module.css';

export default function PageLayout({ children }: { children: React.ReactNode }) {
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell
            header={{ height: { base: 60, sm: 0 } }}
            navbar={{
                width: 250,
                breakpoint: 'sm',
                collapsed: { mobile: !opened },
            }}
            padding={'xl'}
            className={classes.root}
        >
            <AppShell.Header hiddenFrom='sm' className={classes.transparent}>
                <Header opened={opened} toggle={toggle} />
            </AppShell.Header>

            <AppShell.Navbar withBorder={false} className={classes.transparent}>
                <Navbar />
            </AppShell.Navbar>

            <AppShell.Main>
                {children}
            </AppShell.Main>
        </AppShell >
    );
}