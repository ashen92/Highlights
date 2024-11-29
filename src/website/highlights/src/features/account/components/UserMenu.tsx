import { useMsal } from '@azure/msal-react';
import { Menu, Group, Text, Avatar, rem, FloatingPosition, Box } from '@mantine/core';
import {
    IconLogout,
    IconTrash,
    IconBug,
    IconSwitchHorizontal,
    IconUser
} from '@tabler/icons-react';
import { useAppContext } from '../AppContext';
import { useState } from 'react';
import Settings from '@/components/Settings/Settings';
import IssueModal from "@/components/Issues/IssueModal";

export interface UserMenuProps {
    children?: React.ReactNode;
    position?: FloatingPosition;
}

export default function UserMenu(props: UserMenuProps) {
    const { user } = useAppContext();
    const { instance } = useMsal();
    const [settingsOpened, setSettingsOpened] = useState(false);
    const [issueModalOpened, setIssueModalOpened] = useState(false);

    const handleLogout = () => {
        instance.logoutRedirect({
            postLogoutRedirectUri: "/",
        });
    };

    return (
        <>
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
                        <Menu.Item onClick={() => setSettingsOpened(true)}>
                            <Group>
                                <Avatar
                                    radius="xl"
                                    src={user.photo ? `data:image/jpeg;base64,${user.photo}` : undefined}
                                >
                                    <IconUser size="1.5rem" />
                                </Avatar>

                                <Box>
                                    <Text fw={500}>{user.displayName}</Text>
                                    <Text size="xs" c="dimmed">{user.email}</Text>
                                </Box>
                            </Group>
                        </Menu.Item>

                        <Menu.Divider />

                        <Menu.Label>Settings</Menu.Label>
                        <Menu.Item
                            leftSection={<IconBug style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                            onClick={() => setIssueModalOpened(true)}
                        >
                            Report Issue
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
            <Settings
                opened={settingsOpened}
                onClose={() => setSettingsOpened(false)}
            />
            <IssueModal
                opened={issueModalOpened}
                onClose={() => setIssueModalOpened(false)}
            />
        </>
    );
}