import { selectListById } from "@/features/taskLists/taskListsSlice";
import { useAppSelector } from "@/hooks";
import { UnstyledButton } from "@mantine/core";
import Link from "next/link";
import { IconList } from "@tabler/icons-react";
import classes from '../Navbar.module.css';

export default function TaskListExcerpt({ taskListId, active, setActive }: { taskListId: string, active: string, setActive: (label: string) => void }) {
    const taskList = useAppSelector(state => selectListById(state, taskListId));
    return (
        <UnstyledButton
            component={Link}
            href={`/tasks/${taskList.id}`}
            key={taskList.id}
            className={classes.collectionLink}
            data-active={taskList.id === active || undefined}
            onClick={() => {
                setActive(taskList.id);
            }}>
            <div className={classes.mainLinkInner}>
                <span>{taskList.title}</span>
            </div>
        </UnstyledButton>
    );
}