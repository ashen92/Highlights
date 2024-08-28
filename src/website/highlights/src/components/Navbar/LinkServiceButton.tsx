import { Box, Group, UnstyledButton, Image, Text } from "@mantine/core";
import classes from "./Navbar.module.css";
import { useMSGraph } from "@/hooks/useMSGraph";
import { AppUserLinkedAccount, useAppUser } from "@/hooks/useAppUser";
import { useAppDispatch } from "@/hooks";
import { setCredentials } from "@/features/auth/authSlice";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { useAddLinkedAccountMutation } from "@/features/auth/apiUsersSlice";

let MicrosoftToDoButton = () => {
    const dispatch = useAppDispatch();
    const { signIn } = useMSGraph();
    const { user } = useAppUser();
    const [addLinkedAccount, { isLoading }] = useAddLinkedAccountMutation();

    const handleLinkMicrosoftToDo = async () => {
        try {
            await signIn();
            if (user) {
                await addLinkedAccount({ user, account: AppUserLinkedAccount.Microsoft }).unwrap();
            }
            dispatch(setCredentials({
                ...user,
                linkedAccounts: user?.linkedAccounts ? [...user.linkedAccounts, 'Microsoft'] : ['Microsoft']
            }));
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
            <Group className={classes.collectionsHeader} justify="space-between">
                <Text size="sm" fw={500} c="dimmed">
                    Microsoft To Do
                </Text>
            </Group>
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
    return (
        <Box className={classes.section}>
            <Group className={classes.collectionsHeader} justify="space-between">
                <Text size="sm" fw={500} c="dimmed">
                    Google Tasks
                </Text>
            </Group>
            <Box className={classes.collections}>
                <UnstyledButton w={'100%'} className={classes.collectionLink}>
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
    service: 'Microsoft' | 'Google';
}

export default function LinkServiceButton({ service }: LinkServiceButtonProps) {
    if (service === 'Microsoft') {
        return <MicrosoftToDoButton />;
    } else {
        return <GoogleTasksButton />;
    }
}