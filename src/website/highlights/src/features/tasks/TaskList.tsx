import { selectTaskById, selectTaskIds, taskCompleted, taskUncompleted } from "@/features/tasks/tasksSlice";
import { useAppDispatch, useAppSelector } from "@/hooks";
import type { TaskList } from "@/models/TaskList";
import { Checkbox, Group, Paper, Stack, Text } from "@mantine/core";

let TaskExcerpt = ({ taskId }: { taskId: string }) => {
    const dispatch = useAppDispatch();
    const task = useAppSelector(state => selectTaskById(state, taskId))

    return (
        <Paper component={Group} w={'100%'} shadow={'xs'} radius={'md'} py={'xs'} px={'md'} key={task.id}>
            <Checkbox
                radius={'lg'}
                checked={task.completed}
                onChange={() => { task.completed ? dispatch(taskUncompleted(task.id)) : dispatch(taskCompleted(task.id)) }}
            />
            <Text td={task.completed ? 'line-through' : ''}>{task.title}</Text>
        </Paper>
    );
}

export default function TaskList() {
    const orderedTaskIds = useAppSelector(selectTaskIds);

    return (
        <Stack gap={'xs'}>
            {orderedTaskIds.map((taskId) => (
                <TaskExcerpt key={taskId} taskId={taskId} />
            ))}
        </Stack>
    )
}