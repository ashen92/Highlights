import { Box, Group, UnstyledButton, Image, Text } from "@mantine/core";
import classes from "./Navbar.module.css";
import { useMSGraph } from "@/hooks/useMSGraph";
import { useAppUser } from "@/hooks/useAppUser";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { useAddLinkedAccountMutation } from "@/features/auth/apiUsersSlice";
import { LinkedAccount } from "@/features/auth";
import { useEffect } from "react";
import { getUserEmail, initTokenClient, requestAccessToken } from "@/services/GAPIService";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { selectGoogleAccessToken, setGoogleAccessToken } from "@/features/auth/authSlice";

let MicrosoftToDoButton = () => {
    const { signIn } = useMSGraph();
    const { user } = useAppUser();
    const [addLinkedAccount, { isLoading }] = useAddLinkedAccountMutation();

    const handleLinkMicrosoftToDo = async () => {
        try {
            await signIn();
            await addLinkedAccount({ user: user!, account: { name: LinkedAccount.Microsoft } }).unwrap();
        } catch (error) {
            if (error instanceof InteractionRequiredAuthError) {
                if (!(error.errorCode === "user_cancelled") && !(error.errorCode === "access_denied")) {
                    console.error('MSAL Error:', error.errorCode, error.errorMessage);
                }
            } else {
                console.error('Error linking Microsoft To Do:', error);
            }
        }
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
    const dispatch = useAppDispatch();
    const { user } = useAppUser();
    const [addLinkedAccount, { isLoading }] = useAddLinkedAccountMutation();
    const gAPIToken = useAppSelector(selectGoogleAccessToken);

    const handleAuthSuccess = async (token: string) => {
        const email = await getUserEmail(token);
        await addLinkedAccount({ user: user!, account: { name: LinkedAccount.Google, email } }).unwrap();
    }

    useEffect(() => {
        if (gAPIToken) {
            handleAuthSuccess(gAPIToken);
        }
    }, [gAPIToken]);

    const handleTokenResponse = async (response: any) => {
        dispatch(setGoogleAccessToken(response.access_token));
    };

    const handleLinkGoogleTasks = async () => {
        initTokenClient(handleTokenResponse);
        requestAccessToken();
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