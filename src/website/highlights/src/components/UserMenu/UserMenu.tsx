import { Menu, Group, Text, Avatar, useMantineTheme, rem, UnstyledButton, ActionIcon } from '@mantine/core';
import {
    IconLogout,
    IconHeart,
    IconStar,
    IconMessage,
    IconSettings,
    IconPlayerPause,
    IconTrash,
    IconSwitchHorizontal
} from '@tabler/icons-react';

export default function UserMenu({ className }: { className?: string }) {
    const theme = useMantineTheme();
    return (
        <Group>
            <Menu
                withArrow
                width={300}
                position="bottom"
                transitionProps={{ transition: 'pop' }}
                withinPortal
                arrowPosition="center"
            >
                <Menu.Target>
                    <ActionIcon variant='default' size={'xl'} className={className}>
                        <Avatar
                            radius="xl"
                            src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png"
                        />
                    </ActionIcon >
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item>
                        <Group>
                            <Avatar
                                radius="xl"
                                src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png"
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

                    <Menu.Item
                        leftSection={
                            <IconHeart
                                style={{ width: rem(16), height: rem(16) }}
                                stroke={1.5}
                                color={theme.colors.red[6]}
                            />
                        }
                    >
                        Liked posts
                    </Menu.Item>
                    <Menu.Item
                        leftSection={
                            <IconStar
                                style={{ width: rem(16), height: rem(16) }}
                                stroke={1.5}
                                color={theme.colors.yellow[6]}
                            />
                        }
                    >
                        Saved posts
                    </Menu.Item>
                    <Menu.Item
                        leftSection={
                            <IconMessage
                                style={{ width: rem(16), height: rem(16) }}
                                stroke={1.5}
                                color={theme.colors.blue[6]}
                            />
                        }
                    >
                        Your comments
                    </Menu.Item>

                    <Menu.Label>Settings</Menu.Label>
                    <Menu.Item
                        leftSection={<IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                    >
                        Account settings
                    </Menu.Item>
                    <Menu.Item
                        leftSection={
                            <IconSwitchHorizontal style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                        }
                    >
                        Change account
                    </Menu.Item>
                    <Menu.Item
                        leftSection={<IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                    >
                        Logout
                    </Menu.Item>

                    <Menu.Divider />

                    <Menu.Label>Danger zone</Menu.Label>
                    <Menu.Item
                        leftSection={
                            <IconPlayerPause style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                        }
                    >
                        Pause subscription
                    </Menu.Item>
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