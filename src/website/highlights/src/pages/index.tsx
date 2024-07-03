import { AppShell, Burger, Group, NavLink, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export default function Home() {
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
                <Group h="100%" px="md">
                    <Burger
                        opened={opened}
                        onClick={toggle}
                        hiddenFrom="sm"
                        size="sm"
                    />
                    <Text fw={600}>Highlights</Text>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <AppShell.Section>Navbar header
                    <NavLink
                        href="#required-for-focus"
                        label="Highlights"
                    />
                    <NavLink
                        href="#required-for-focus"
                        label="Calendar"
                    />
                    <NavLink
                        href="#required-for-focus"
                        label="Tasks"
                    />
                </AppShell.Section>
            </AppShell.Navbar>

            <AppShell.Main>Main</AppShell.Main>
        </AppShell>
    );
}