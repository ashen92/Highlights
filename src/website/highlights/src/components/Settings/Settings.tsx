import {
    Modal,
    Tabs,
    rem,
    Box,
    ScrollArea,
    Container
} from '@mantine/core';
import {
    IconUser,
    IconPlugConnected,
    IconBell,
    IconPalette,
    IconShield,
} from '@tabler/icons-react';
import AccountPanel from './Panels/AccountPanel';
import IntegrationsPanel from './Panels/IntegrationsPanel';
import NotificationsPanel from './Panels/NotificationsPanel';
import AppearancePanel from './Panels/AppearancePanel';
import PrivacyPanel from './Panels/PrivacyPanel';
import classes from './Settings.module.css';

interface SettingsProps {
    opened: boolean;
    onClose: () => void;
}

export default function Settings({ opened, onClose }: SettingsProps) {
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Settings"
            size="xl"
            centered
            className={classes.modal}
        >
            <Tabs defaultValue="account" orientation="vertical" variant='pills' className={classes.tabs} pt={'md'}>
                <Tabs.List className={classes.tabsList}>
                    <Tabs.Tab
                        value="account"
                        leftSection={<IconUser style={{ width: rem(16), height: rem(16) }} />}
                        className={classes.tab}
                    >
                        Account
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="integrations"
                        leftSection={<IconPlugConnected style={{ width: rem(16), height: rem(16) }} />}
                        className={classes.tab}
                    >
                        Integrations
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="notifications"
                        leftSection={<IconBell style={{ width: rem(16), height: rem(16) }} />}
                        className={classes.tab}
                    >
                        Notifications
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="appearance"
                        leftSection={<IconPalette style={{ width: rem(16), height: rem(16) }} />}
                        className={classes.tab}
                    >
                        Appearance
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="privacy"
                        leftSection={<IconShield style={{ width: rem(16), height: rem(16) }} />}
                        className={classes.tab}
                    >
                        Privacy & Security
                    </Tabs.Tab>
                </Tabs.List>

                <Container className={classes.content}>
                    <ScrollArea h={500}>
                        <Box px={'md'}>
                            <Tabs.Panel value="account">
                                <AccountPanel />
                            </Tabs.Panel>

                            <Tabs.Panel value="integrations">
                                <IntegrationsPanel />
                            </Tabs.Panel>

                            <Tabs.Panel value="notifications">
                                <NotificationsPanel />
                            </Tabs.Panel>

                            <Tabs.Panel value="appearance">
                                <AppearancePanel />
                            </Tabs.Panel>

                            <Tabs.Panel value="privacy">
                                <PrivacyPanel />
                            </Tabs.Panel>
                        </Box>
                    </ScrollArea>
                </Container>
            </Tabs>
        </Modal>
    );
}