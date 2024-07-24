import React from 'react';
import { Button, Menu } from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';
import { useAppDispatch } from '@/hooks';
import { highlightRemoved } from '../highlightsSlice';

export function HighlightActionsMenu({ id }: { id: string }) {

    const dispatch = useAppDispatch();

    const handleRemove = (id: string) => {
        dispatch(highlightRemoved(id));
    }

    return (
        <Menu>
            <Menu.Target>
                <Button variant="default" size='compact-sm'>
                    <IconDotsVertical size={18} />
                </Button>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Item>Modify</Menu.Item>
                <Menu.Item>Add Task</Menu.Item>
                <Menu.Item onClick={() => handleRemove(id)}>Remove</Menu.Item>
                <Menu.Item>Start Focus</Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
};