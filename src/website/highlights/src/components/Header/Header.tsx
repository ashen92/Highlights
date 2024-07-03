import { Box, Burger, Group, UnstyledButton } from "@mantine/core";
import ColorSchemeToggle from "../ColorSchemeToggle/ColorSchemeToggle";
import UserMenu from "../UserMenu/UserMenu";
import classes from './Header.module.css';

export default function Header({ opened, toggle }: { opened: boolean; toggle: () => void; }) {
    return (
        <Group h="100%" px="xl">
            <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
            />
            <UnstyledButton component="a" href="/" fw={600}>Highlights</UnstyledButton>
            <Box ml="auto"></Box>
            <ColorSchemeToggle className={classes.item} />
            <UserMenu className={classes.item} />
        </Group>
    );
}