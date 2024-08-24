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
                width: 300,
                breakpoint: 'sm',
                collapsed: { mobile: !opened },
            }}
        // padding="md"
        >
            <AppShell.Header hiddenFrom='sm' className={classes.root}>
                <Header opened={opened} toggle={toggle} />
            </AppShell.Header>

            <AppShell.Navbar className={classes.root}>
                <Navbar />
            </AppShell.Navbar>

            <AppShell.Main>
                {/* <Box m={'xs'}> */}
                {children}
                {/* </Box> */}
            </AppShell.Main>
        </AppShell>
    );
}