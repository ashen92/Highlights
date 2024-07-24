import React from 'react';
import { Menu, UnstyledButton } from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';
import { useAppDispatch } from '@/hooks';
import { highlightRemoved } from '../highlightsSlice';
import { Highlight } from '@/models/Highlight';

interface HighlightActionsMenuProps {
    highlight: Highlight;
    onModifyHighlight: (highlight: Highlight) => void;
}

export function HighlightActionsMenu({ highlight, onModifyHighlight }: HighlightActionsMenuProps) {

    const dispatch = useAppDispatch();

    const handleRemove = (id: string) => {
        dispatch(highlightRemoved(id));
    }

    return (
        <Menu>
            <Menu.Target>
                <UnstyledButton>
                    <IconDotsVertical size={18} />
                </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Item onClick={() => onModifyHighlight(highlight)}>Modify</Menu.Item>
                <Menu.Item>Add Task</Menu.Item>
                <Menu.Item onClick={() => handleRemove(highlight.id)}>Remove</Menu.Item>
                <Menu.Item>Start Focus</Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
};