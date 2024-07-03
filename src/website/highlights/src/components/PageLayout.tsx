import { AppShell, Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Navbar from './Navbar/Navbar';
import Header from './Header/Header';

export default function PageLayout({ children }: { children: React.ReactNode }) {
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: { mobile: !opened },
            }}
            padding="md"
        >
            <AppShell.Header>
                <Header opened={opened} toggle={toggle} />
            </AppShell.Header>

            <AppShell.Navbar>
                <Navbar />
            </AppShell.Navbar>

            <AppShell.Main>
                <Box m={'xs'}>
                    {children}
                </Box>
            </AppShell.Main>
        </AppShell>
    );
}