import { ReactNode } from 'react';
import { ErrorScreen } from './ErrorScreen';
import { LoadingScreen } from './LoadingScreen';
import { useAppContext } from '../AppContext';
import { useMicrosoftToDoContext } from '../../integrations/microsoft/MicrosoftToDoContext';

interface AppInitializerProps {
    children: ReactNode;
}

export const AppInitializer = ({ children }: AppInitializerProps) => {
    const { isLoading, isInitialized: isAppContextInitialized, error } = useAppContext();
    const { isInitialized: isMicrosoftToDoContextInitialized } = useMicrosoftToDoContext();

    if (error) {
        return <ErrorScreen message={error.message} />;
    }

    if (!isAppContextInitialized || !isMicrosoftToDoContextInitialized || isLoading) {
        return <LoadingScreen />;
    }

    return <>{children}</>;
};