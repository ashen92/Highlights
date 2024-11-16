import {
    Text,
    Stack,
    Switch,
    Divider,
} from '@mantine/core';

export default function PrivacyPanel() {
    return (
        <Stack>
            <Text fw={500} size="lg">Privacy & Security Settings</Text>
            <Switch
                label="Two-Factor Authentication"
                description="Add an extra layer of security to your account"
            />
            <Divider />
            <Switch
                label="Activity Log"
                description="Track all activities on your account"
            />
            <Divider />
            <Switch
                label="Data Sharing"
                description="Allow anonymous data collection for service improvement"
            />
        </Stack>
    );
}