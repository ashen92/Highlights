import { Box, UnstyledButton, Image } from "@mantine/core";
import classes from "./Navbar.module.css";
import { LinkedAccount } from "@/features/auth";
import { useMicrosoftGraph } from "@/features/integrations/microsoft";
import { useGoogleAPI } from "@/features/integrations/google/GoogleAPIContext";

let MicrosoftToDoButton = () => {
    const { beginAccountLinking } = useMicrosoftGraph();

    const handleLinkMicrosoftToDo = async () => {
        await beginAccountLinking();
    };

    return (
        <Box className={classes.section}>
            <Box className={classes.collections}>
                <UnstyledButton
                    onClick={handleLinkMicrosoftToDo}
                    w={'100%'}
                    className={classes.collectionLink}
                >
                    <Box className={classes.mainLinkInner}>
                        <Image
                            className={classes.mainLinkIcon}
                            radius="md"
                            h={18}
                            src="/microsoft-to-do-logo.png"
                            alt="Microsoft To Do Logo"
                        />
                        <span>Link Microsoft To Do</span>
                    </Box>
                </UnstyledButton>
            </Box>
        </Box>
    );
}

let GoogleTasksButton = () => {
    const { startLinking, isLinking } = useGoogleAPI();

    return (
        <Box className={classes.section}>
            <Box className={classes.collections}>
                <UnstyledButton
                    onClick={startLinking}
                    w={'100%'}
                    className={classes.collectionLink}
                    disabled={isLinking}
                >
                    <Box className={classes.mainLinkInner}>
                        <Image
                            className={classes.mainLinkIcon}
                            radius="md"
                            h={23}
                            src="/google-tasks-logo.png"
                            alt="Google Tasks Logo"
                        />
                        <span>{isLinking ? 'Linking...' : 'Link Google Tasks'}</span>
                    </Box>
                </UnstyledButton>
            </Box>
        </Box>
    );
}

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