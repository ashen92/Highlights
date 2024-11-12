import { Alert, Center } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

interface ErrorScreenProps {
    message: string;
}

export const ErrorScreen = ({ message }: ErrorScreenProps) => {
    return (
        <Center h="100vh" p="md">
            <Alert
                icon={<IconAlertCircle size="1.1rem" />}
                title="Error"
                color="red"
                variant="filled"
            >
                {message}
            </Alert>
        </Center>
    );
};