import {
    Text,
    Stack,
    Switch,
    Divider,
} from '@mantine/core';

export default function NotificationsPanel() {
    return (
        <Stack>
            <Text fw={500} size="lg">Notification Preferences</Text>

            <Stack gap="xs">
                <Switch
                    label="Email Notifications"
                    description="Receive important updates via email"
                    defaultChecked
                />
                <Divider />
                <Switch
                    label="Task Reminders"
                    description="Get notified about upcoming tasks"
                    defaultChecked
                />
                <Divider />
                <Switch
                    label="Calendar Events"
                    description="Notifications for calendar events"
                    defaultChecked
                />
                <Divider />
                <Switch
                    label="System Notifications"
                    description="Updates about system maintenance and changes"
                    defaultChecked
                />
            </Stack>
        </Stack>
    );
}