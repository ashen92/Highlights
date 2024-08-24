import { ActionIcon, Avatar, Box, Burger, Group } from "@mantine/core";
import UserMenu from "../UserMenu/UserMenu";
import classes from './Header.module.css';
import Logo from "../Navbar/Logo/Logo";

export default function Header({ opened, toggle }: { opened: boolean; toggle: () => void; }) {
    return (
        <Group h="100%" px="xl">
            <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
            />
            <Logo />
            <Box ml="auto"></Box>
            <UserMenu>
                <ActionIcon variant='default' size={'xl'} className={classes.item}>
                    <Avatar
                        radius="xl"
                        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
                    />
                </ActionIcon >
            </UserMenu>
        </Group>
    );
}