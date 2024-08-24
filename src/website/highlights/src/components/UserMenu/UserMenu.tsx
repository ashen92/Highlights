import { useMsal } from '@azure/msal-react';
import { Menu, Group, Text, Avatar, useMantineTheme, rem, FloatingPosition, Box } from '@mantine/core';
import {
    IconLogout,
    IconTrash,
    IconSwitchHorizontal
} from '@tabler/icons-react';

export interface UserMenuProps {
    children?: React.ReactNode;
    position?: FloatingPosition;
}

export default function UserMenu(props: UserMenuProps) {
    const theme = useMantineTheme();

    const { instance } = useMsal();

    const handleLogout = () => {
        instance.logoutRedirect({
            postLogoutRedirectUri: "/",
        });
    }

    return (
        <Group grow>
            <Menu
                withArrow
                width={300}
                position={props.position}
                transitionProps={{ transition: 'pop' }}
                withinPortal
                arrowPosition="center"
            >
                <Menu.Target>
                    <Box>{props.children}</Box>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item>
                        <Group>
                            <Avatar
                                radius="xl"
                                src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
                            />

                            <div>
                                <Text fw={500}>Nancy Eggshacker</Text>
                                <Text size="xs" c="dimmed">
                                    neggshaker@mantine.dev
                                </Text>
                            </div>
                        </Group>
                    </Menu.Item>

                    <Menu.Divider />

                    <Menu.Label>Settings</Menu.Label>
                    <Menu.Item
                        leftSection={
                            <IconSwitchHorizontal style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                        }
                    >
                        Change account
                    </Menu.Item>
                    <Menu.Item
                        leftSection={<IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                        onClick={() => { handleLogout() }}
                    >
                        Logout
                    </Menu.Item>

                    <Menu.Divider />

                    <Menu.Item
                        color="red"
                        leftSection={<IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                    >
                        Delete account
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </Group >
    );
}