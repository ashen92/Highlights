import { ReactNode } from 'react';
import { ErrorScreen } from './ErrorScreen';
import { LoadingScreen } from './LoadingScreen';
import { useAppContext } from '../AppContext';
import { useGoogleAPI } from '@/features/integrations/google';
import { useMicrosoftGraph } from '@/features/integrations/microsoft';

interface AppInitializerProps {
    children: ReactNode;
}

export const AppInitializer = ({ children }: AppInitializerProps) => {
    const {
        isLoading,
        isInitialized,
        error,
        authError,
        userDataError
    } = useAppContext();

    const {
        isInitialized: isGoogleInitialized,
        error: googleError,
        isLinked: isGoogleLinked
    } = useGoogleAPI();

    const {
        isInitialized: isMicrosoftInitialized,
    } = useMicrosoftGraph();

    if (isInitialized && (authError || userDataError)) {
        return (
            <ErrorScreen
                message={
                    authError
                        ? "Authentication failed. Please try signing in again."
                        : "Failed to load user data. Please refresh the page or try again later."
                }
            />
        );
    }

    if (!isInitialized || isLoading) {
        return <LoadingScreen />;
    }

    if ((isGoogleLinked && !isGoogleInitialized) || (!isMicrosoftInitialized)) {
        return <LoadingScreen />;
    }

    if ((isGoogleLinked && googleError)) {
        return (
            <ErrorScreen
                message="Failed to initialize linked services. Please try unlinking and relinking your accounts."
            />
        );
    }

    return <>{children}</>;
};