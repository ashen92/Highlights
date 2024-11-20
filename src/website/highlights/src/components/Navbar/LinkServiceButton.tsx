import { Box, UnstyledButton, Image } from "@mantine/core";
import classes from "./Navbar.module.css";
import { LinkedAccount } from "@/features/auth";
import { useMicrosoftGraph } from "@/features/integrations/microsoft";
import { useGoogleAPI } from "@/features/integrations/google/GoogleAPIContext";

interface ServiceButtonProps {
    onClick: () => Promise<void>;
    isLoading: boolean;
    imageSrc: string;
    imageAlt: string;
    serviceName: string;
}

const ServiceButton = ({ onClick, isLoading, imageSrc, imageAlt, serviceName }: ServiceButtonProps) => (
    <Box className={classes.section} px={'xs'}>
        <UnstyledButton
            onClick={onClick}
            w={'100%'}
            className={classes.serviceLink}
            disabled={isLoading}
        >
            <Box className={classes.mainLinkInner}>
                <Image
                    className={classes.mainLinkIcon}
                    radius="md"
                    h={serviceName === 'Microsoft To Do' ? 18 : 23}
                    src={imageSrc}
                    alt={imageAlt}
                />
                <span>{isLoading ? 'Linking...' : `Link ${serviceName}`}</span>
            </Box>
        </UnstyledButton>
    </Box>
);

const MicrosoftToDoButton = () => {
    const { startLinking, isLinking } = useMicrosoftGraph();

    return (
        <ServiceButton
            onClick={startLinking}
            isLoading={isLinking}
            imageSrc="/microsoft-to-do-logo.png"
            imageAlt="Microsoft To Do Logo"
            serviceName="Microsoft To Do"
        />
    );
};

const GoogleTasksButton = () => {
    const { startLinking, isLinking } = useGoogleAPI();

    return (
        <ServiceButton
            onClick={startLinking}
            isLoading={isLinking}
            imageSrc="/google-tasks-logo.png"
            imageAlt="Google Tasks Logo"
            serviceName="Google Tasks"
        />
    );
};

export interface LinkServiceButtonProps {
    service: LinkedAccount;
}

export default function LinkServiceButton(props: LinkServiceButtonProps) {
    if (props.service === LinkedAccount.Microsoft) {
        return <MicrosoftToDoButton />;
    } else {
        return <GoogleTasksButton />;
    }
}