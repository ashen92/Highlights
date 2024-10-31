import { ReactNode } from 'react';
import { ErrorScreen } from './ErrorScreen';
import { LoadingScreen } from './LoadingScreen';
import { useAppContext } from '../AppContext';

interface AppInitializerProps {
    children: ReactNode;
}

export const AppInitializer = ({ children }: AppInitializerProps) => {
    const { isLoading, isInitialized, error } = useAppContext();

    if (error) {
        return <ErrorScreen message={error.message} />;
    }

    if (!isInitialized || isLoading) {
        return <LoadingScreen />;
    }

    return <>{children}</>;
};