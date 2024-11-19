import {
    Text,
    Stack,
    Button,
    Group,
    Paper,
    rem,
} from '@mantine/core';
import {
    IconBrandGoogle,
    IconBrandWindows,
    IconLink,
    IconUnlink
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { LinkedAccount } from '@/features/auth';
import { useAppContext } from '@/features/account/AppContext';

export default function IntegrationsPanel() {
    const { user, refreshUser } = useAppContext();

    const handleUnlinkAccount = async (service: LinkedAccount) => {
        try {
            // TODO: Implement unlink logic
            notifications.show({
                title: 'Success',
                message: `Unlinked ${service} account successfully`,
                color: 'green'
            });
            await refreshUser();
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: `Failed to unlink ${service} account`,
                color: 'red'
            });
        }
    };

    return (
        <Stack>
            <Text fw={500} size="lg">Connected Services</Text>

            <Paper withBorder p="md">
                <Group justify="space-between">
                    <Group>
                        <IconBrandWindows style={{ width: rem(24), height: rem(24) }} />
                        <div>
                            <Text>Microsoft Account</Text>
                            <Text size="xs" c="dimmed">
                                {user.linkedAccounts.find(a => a.name === LinkedAccount.Microsoft)?.email || 'Not connected'}
                            </Text>
                        </div>
                    </Group>
                    {user.linkedAccounts.find(a => a.name === LinkedAccount.Microsoft) ? (
                        <Button
                            variant="light"
                            color="red"
                            leftSection={<IconUnlink size={14} />}
                            onClick={() => handleUnlinkAccount(LinkedAccount.Microsoft)}
                        >
                            Unlink
                        </Button>
                    ) : (
                        <Button
                            variant="light"
                            leftSection={<IconLink size={14} />}
                        >
                            Connect
                        </Button>
                    )}
                </Group>
            </Paper>

            <Paper withBorder p="md">
                <Group justify="space-between">
                    <Group>
                        <IconBrandGoogle style={{ width: rem(24), height: rem(24) }} />
                        <div>
                            <Text>Google Account</Text>
                            <Text size="xs" c="dimmed">
                                {user.linkedAccounts.find(a => a.name === LinkedAccount.Google)?.email || 'Not connected'}
                            </Text>
                        </div>
                    </Group>
                    {user.linkedAccounts.find(a => a.name === LinkedAccount.Google) ? (
                        <Button
                            variant="light"
                            color="red"
                            leftSection={<IconUnlink size={14} />}
                            onClick={() => handleUnlinkAccount(LinkedAccount.Google)}
                        >
                            Unlink
                        </Button>
                    ) : (
                        <Button
                            variant="light"
                            leftSection={<IconLink size={14} />}
                        >
                            Connect
                        </Button>
                    )}
                </Group>
            </Paper>
        </Stack>
    );
}