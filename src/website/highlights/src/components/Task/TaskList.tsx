import { useTasks } from "@/hooks/useTasks";
import type { Task } from "@/models/Task";
import type { TaskList } from "@/models/TaskList";
import { taskListState } from "@/recoil_state";
import { useRecoilValue } from "recoil";

export default function TaskList() {
    const taskLists = useRecoilValue(taskListState);

    return (
        <>
            <ul>
                {taskLists?.map((list: TaskList) => (
                    list.tasks.map((task: Task) => (
                        <li key={task.id}>{task.title}</li>
                    ))
                ))}
            </ul>
        </>
    )
}