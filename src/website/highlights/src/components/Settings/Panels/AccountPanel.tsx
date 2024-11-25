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
import { IconMail, IconTrash, IconUpload, IconUser } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { useAppContext } from '@/features/account/AppContext';
import { useUpdateUserPhotoMutation, useDeleteUserPhotoMutation } from '@/features/auth/apiUsersSlice';
import { updateDisplayName } from '@/features/account/GraphService';

export default function AccountPanel() {
    const { user, refreshUser, graphAuthProvider } = useAppContext();
    const [uploading, setUploading] = useState(false);
    const [pendingPhotoFile, setPendingPhotoFile] = useState<File | null>(null);
    const [updatePhoto] = useUpdateUserPhotoMutation();
    const [deletePhoto] = useDeleteUserPhotoMutation();

    const form = useForm({
        initialValues: {
            displayName: user.displayName || '',
            email: user.email || '',
        },
    });

    const [pendingDelete, setPendingDelete] = useState(false);

    const handleProfileUpdate = async (values: typeof form.values) => {
        try {
            setUploading(true);

            if (values.displayName !== user.displayName) {
                await updateDisplayName(graphAuthProvider, values.displayName);
            }

            const updates: Promise<any>[] = [];
            if (pendingPhotoFile) {
                updates.push(updatePhoto({
                    userId: user.id,
                    image: pendingPhotoFile
                }).unwrap());
            }

            if (pendingDelete) {
                updates.push(deletePhoto(user.id).unwrap());
            }

            if (updates.length > 0) {
                await Promise.all(updates);
            }

            await refreshUser(true);

            setPendingPhotoFile(null);
            setPendingDelete(false);
            notifications.show({
                title: 'Success',
                message: 'Profile updated successfully',
                color: 'green'
            });

        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to update profile',
                color: 'red'
            });
        } finally {
            setUploading(false);
        }
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                notifications.show({
                    title: 'Error',
                    message: 'Image size must be less than 1MB',
                    color: 'red'
                });
                return;
            }

            if (!['image/jpeg', 'image/jpg'].includes(file.type)) {
                notifications.show({
                    title: 'Error',
                    message: 'Please select a JPEG image file',
                    color: 'red'
                });
                return;
            }

            setPendingPhotoFile(file);
        }
    };

    const handleDeletePhoto = () => {
        setPendingDelete(true);
        setPendingPhotoFile(null);
    };

    const hasChanges = pendingPhotoFile !== null || pendingDelete || form.values.displayName !== user.displayName;

    return (
        <form onSubmit={form.onSubmit(handleProfileUpdate)}>
            <Stack>
                <Text fw={500} size="lg">Profile Information</Text>

                <Group>
                    <Avatar
                        size="xl"
                        src={pendingPhotoFile ? URL.createObjectURL(pendingPhotoFile) : (!pendingDelete && user.photo) ? `data:image/jpeg;base64,${user.photo}` : undefined}
                        radius="xl"
                    >
                        <IconUser size="2rem" />
                    </Avatar>
                    <Stack gap="xs">
                        <Group>
                            <Button
                                variant="light"
                                size="sm"
                                leftSection={<IconUpload size={14} />}
                                loading={uploading}
                                component="label"
                            >
                                Choose Picture
                                <input
                                    type="file"
                                    accept="image/jpeg,image/jpg"
                                    style={{ display: 'none' }}
                                    onChange={handleImageUpload}
                                />
                            </Button>
                            <ActionIcon
                                variant="light"
                                color="red"
                                size="sm"
                                aria-label="Remove picture"
                                disabled={!user.photo && !pendingPhotoFile}
                                onClick={handleDeletePhoto}
                            >
                                <IconTrash style={{ width: rem(14), height: rem(14) }} />
                            </ActionIcon>
                        </Group>
                        <Text size="xs" c="dimmed">
                            Recommended: Square JPEG only, 1MB max
                        </Text>
                    </Stack>
                </Group>

                <Stack gap="md">
                    <Group>
                        <IconMail size={20} />
                        <Text>{user.email}</Text>
                    </Group>
                    <TextInput
                        label="Display Name"
                        placeholder="Your name"
                        {...form.getInputProps('displayName')}
                    />
                </Stack>

                <Button mt={'md'} type="submit" disabled={!hasChanges}>
                    Save Changes
                </Button>
            </Stack>
        </form>
    );
}