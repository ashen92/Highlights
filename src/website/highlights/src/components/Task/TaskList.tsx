import { useAppSelector } from "@/hooks";
import type { Task } from "@/models/Task";
import type { TaskList } from "@/models/TaskList";

export default function TaskList() {
    const tasks = useAppSelector(state => state.tasks);

    return (
        <>
            <ul>
                {tasks.map((task: Task) => (
                    <li key={task.id}>{task.title}</li>
                ))}
            </ul>
        </>
    )
}