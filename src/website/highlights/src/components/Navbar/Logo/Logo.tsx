import { Box, MantineBreakpoint, UnstyledButton } from "@mantine/core";

export default function Logo({ visibleFrom }: { visibleFrom?: MantineBreakpoint }) {
    return (
        <Box visibleFrom={visibleFrom}>
            <UnstyledButton component="a" href="/" fw={600}>Highlights</UnstyledButton>
        </Box>
    );
}