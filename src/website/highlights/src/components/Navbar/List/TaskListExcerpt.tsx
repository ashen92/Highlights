import { useAppSelector } from "@/hooks";
import { UnstyledButton } from "@mantine/core";
import Link from "next/link";
import classes from '../Navbar.module.css';
import { TaskListsSlice } from "@/features/tasks";

export default function TaskListExcerpt({ taskListId, active, setActive }: {
    taskListId: string,
    active: string,
    setActive: (label: string) => void
}) {
    const taskList = useAppSelector(state =>
        TaskListsSlice.selectListById(state, taskListId)
    );

    if (!taskList) {
        return null;
    }

    return (
        <UnstyledButton
            component={Link}
            href={`/tasks/${taskList.id}`}
            key={taskList.id}
            className={classes.collectionLink}
            data-active={taskList.id === active || undefined}
            onClick={() => {
                setActive(taskList.id);
            }}
        >
            <div className={classes.mainLinkInner}>
                <span>{taskList.title}</span>
            </div>
        </UnstyledButton>
    );
}