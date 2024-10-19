import { fetchTasks, selectTaskById, taskCompleted, taskRemoved, taskUncompleted } from "@/features/tasks/tasksSlice";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { Button, Checkbox, Group, Menu, Paper, Stack, Text } from "@mantine/core";
import { selectListById, taskRemovedFromTaskList } from "../../taskLists/taskListsSlice";
import classes from './TaskList.module.css';
import { IconDotsVertical, IconTrash } from "@tabler/icons-react";
import { deleteTask as deleteMSTask } from "@/services/GraphService";
import { TaskListSource } from "@/features/taskLists";
import { deleteTask as deleteGTask } from "@/services/GAPIService";
import { selectGoogleAccessToken } from "@/features/auth/authSlice";

let TaskExcerpt = ({ taskId, taskListId }: { taskId: string, taskListId: string }) => {
    const dispatch = useAppDispatch();
    const task = useAppSelector(state => selectTaskById(state, taskId));
    const list = useAppSelector(state => selectListById(state, taskListId));

    const gAPIToken = useAppSelector(selectGoogleAccessToken);

    const handleDelete = () => {
        if (list.source === TaskListSource.MicrosoftToDo) {
            deleteMSTask(taskListId, taskId);
        } else if (list.source === TaskListSource.GoogleTasks) {
            if (!gAPIToken) {
                throw new Error('No Google authentication token found');
            }
            deleteGTask(gAPIToken, taskListId, taskId);
        }
        dispatch(taskRemoved(task.id));
        dispatch(taskRemovedFromTaskList({ taskListId, taskId }));
    };

    if (!task) return null;

    return (
        <Group
            px={'md'}
            key={task.id}
            className={classes.task}
            wrap="nowrap"
        >
            <Group wrap="nowrap">
                <Checkbox
                    radius={'lg'}
                    checked={task.status === 'completed'}
                    onChange={() => { task.status === 'completed' ? dispatch(taskUncompleted(task.id)) : dispatch(taskCompleted(task.id)) }}
                />
                <Text
                    td={task.status === 'completed' ? 'line-through' : ''}
                >{task.title}</Text>
            </Group>
            <Menu>
                <Menu.Target>
                    <Button style={{ flexShrink: 0 }} ml={'auto'} variant="transparent" color="dark"><IconDotsVertical size={18} /></Button>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Item leftSection={<IconTrash size={14} />} onClick={handleDelete}>
                        Delete
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </Group>
    );
}

export function TaskList({ taskListId }: { taskListId: string }) {
    const dispatch = useAppDispatch();

    const taskList = useAppSelector((state) => selectListById(state, taskListId));
    const orderedTaskIds = taskList.taskIds;

    if (orderedTaskIds === undefined) {
        dispatch(fetchTasks(taskList));
    }

    if (orderedTaskIds?.length === 0) return;

    return (
        <Paper px={'md'}>
            <Stack py={'md'} gap={'xs'}>
                {orderedTaskIds?.map((taskId) => (
                    <TaskExcerpt key={taskId} taskId={taskId} taskListId={taskListId} />
                ))}
            </Stack>
        </Paper>
    )
}