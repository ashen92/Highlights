import {
    Text,
    Stack,
    Switch,
    Divider,
} from '@mantine/core';

export default function AppearancePanel() {
    return (
        <Stack>
            <Text fw={500} size="lg">Appearance Settings</Text>
            <Switch
                label="Dark Mode"
                description="Toggle between light and dark theme"
            />
            <Divider />
            <Switch
                label="Compact Mode"
                description="Reduce spacing and size of elements"
            />
            <Divider />
            <Switch
                label="High Contrast"
                description="Increase contrast for better visibility"
            />
        </Stack>
    );
}