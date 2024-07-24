import React from 'react';
import { Menu, UnstyledButton } from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';
import { useAppDispatch } from '@/hooks';

export function TaskActionsMenu({ id }: { id: string }) {

    const dispatch = useAppDispatch();

    const handleRemove = (id: string) => {
    }

    return (
        <Menu>
            <Menu.Target>
                <UnstyledButton>
                    <IconDotsVertical size={18} />
                </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Item>Modify</Menu.Item>
                <Menu.Item onClick={() => handleRemove(id)}>Remove</Menu.Item>
                <Menu.Item>Start Focus</Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
};