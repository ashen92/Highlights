import { Box, UnstyledButton, Image } from "@mantine/core";
import classes from "./Navbar.module.css";
import { useAddLinkedAccountMutation } from "@/features/auth/apiUsersSlice";
import { LinkedAccount } from "@/features/auth";
import { useAppContext } from "@/features/account/AppContext";
import { useMicrosoftGraph } from "@/features/integrations/microsoft";
import { GoogleUserService } from "@/features/integrations/google";

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
    const { user } = useAppContext();
    const [addLinkedAccount, { isLoading }] = useAddLinkedAccountMutation();

    const handleLinkGoogleTasks = async () => {
        try {
            const email = await GoogleUserService.getUserEmail();
            await addLinkedAccount({ user: user, account: { name: LinkedAccount.Google, email } }).unwrap();
        } catch (error) {
            console.error('Error linking Google Tasks:', error);
        }
    };

    return (
        <Box className={classes.section}>
            <Box className={classes.collections}>
                <UnstyledButton onClick={handleLinkGoogleTasks} w={'100%'} className={classes.collectionLink}>
                    <Box className={classes.mainLinkInner}>
                        <Image
                            className={classes.mainLinkIcon}
                            radius="md"
                            h={23}
                            src="/google-tasks-logo.png"
                            alt="Google Tasks Logo"
                        />
                        <span>Link Google Tasks</span>
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