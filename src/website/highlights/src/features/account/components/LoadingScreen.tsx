import { Center, Loader } from '@mantine/core';

export const LoadingScreen = () => {
    return (
        <Center h={'100vh'}>
            <Loader size={'xl'} />
        </Center>
    );
};