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
        isLoading: isAppLoading,
        isInitialized: isAppInitialized,
        error: appError,
        user
    } = useAppContext();

    const {
        isInitialized: isGoogleInitialized,
        error: googleError,
        isLinked: isGoogleLinked
    } = useGoogleAPI();

    const {
        isInitialized: isMicrosoftInitialized,
        error: microsoftError,
        isLinked: isMicrosoftLinked
    } = useMicrosoftGraph();

    if (isAppLoading || !isAppInitialized) {
        return <LoadingScreen />;
    }

    if (appError) {
        return <ErrorScreen message={appError.message} />;
    }

    const isGooglePending = isGoogleLinked && !isGoogleInitialized;

    const isMicrosoftPending = isMicrosoftLinked && !isMicrosoftInitialized;

    if (isGooglePending || isMicrosoftPending) {
        return <LoadingScreen />;
    }

    if ((isGoogleLinked && googleError) || (isMicrosoftLinked && microsoftError)) {
        return (
            <ErrorScreen
                message="Failed to initialize linked services. Please try unlinking and relinking your accounts."
            />
        );
    }

    return <>{children}</>;
};