import {
    Text,
    Stack,
    TextInput,
    Button,
    Avatar,
    Group,
    ActionIcon,
    rem,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconTrash, IconUpload } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { useAppContext } from '@/features/account/AppContext';

export default function AccountPanel() {
    const { user, refreshUser } = useAppContext();
    const [uploading, setUploading] = useState(false);

    const form = useForm({
        initialValues: {
            displayName: user.displayName || '',
            email: user.email || '',
        },
    });

    const handleProfileUpdate = async (values: typeof form.values) => {
        try {
            // TODO: Implement profile update logic
            notifications.show({
                title: 'Success',
                message: 'Profile updated successfully',
                color: 'green'
            });
            await refreshUser();
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to update profile',
                color: 'red'
            });
        }
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploading(true);
            try {
                // TODO: Implement image upload logic
                notifications.show({
                    title: 'Success',
                    message: 'Profile picture updated successfully',
                    color: 'green'
                });
                await refreshUser();
            } catch (error) {
                notifications.show({
                    title: 'Error',
                    message: 'Failed to upload profile picture',
                    color: 'red'
                });
            } finally {
                setUploading(false);
            }
        }
    };

    return (
        <form onSubmit={form.onSubmit(handleProfileUpdate)}>
            <Stack>
                <Text fw={500} size="lg">Profile Information</Text>

                <Group>
                    <Avatar
                        size="xl"
                        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
                        radius="xl"
                    />
                    <Stack gap="xs">
                        <Group>
                            <Button
                                variant="light"
                                size="sm"
                                leftSection={<IconUpload size={14} />}
                                loading={uploading}
                                component="label"
                            >
                                Upload Picture
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleImageUpload}
                                />
                            </Button>
                            <ActionIcon
                                variant="light"
                                color="red"
                                size="sm"
                                aria-label="Remove picture"
                            >
                                <IconTrash style={{ width: rem(14), height: rem(14) }} />
                            </ActionIcon>
                        </Group>
                        <Text size="xs" c="dimmed">
                            Recommended: Square PNG or JPG, 1MB max
                        </Text>
                    </Stack>
                </Group>

                <TextInput
                    label="Display Name"
                    placeholder="Your name"
                    {...form.getInputProps('displayName')}
                />

                <TextInput
                    label="Email"
                    placeholder="Your email"
                    readOnly
                    {...form.getInputProps('email')}
                />

                <Button type="submit">Save Changes</Button>
            </Stack>
        </form>
    );
}