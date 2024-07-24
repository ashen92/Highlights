import { useTasks } from "@/hooks/useTasks";
import { Task } from "@/models/Task";

export default function TaskList() {
    const { tasks, isLoading, isError } = useTasks();

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading tasks.</div>;

    return (
        <>
            <ul>
                {tasks?.map((task: Task) => (
                    <li key={task.id}>{task.title}</li>
                ))}
            </ul>
        </>
    )
}