import React, { ReactNode, useState, useEffect } from "react";
import { Card, Group, Text, Button } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare as faRegularSquare } from "@fortawesome/free-regular-svg-icons";
import { faCheckSquare as faSolidSquare } from "@fortawesome/free-solid-svg-icons";
import Confetti from "react-confetti";
import PageLayout from "@/components/PageLayout/PageLayout";
import OptionsMenu from "@/components/Optionmenu/OptionPopup";
import Overdue from "@/components/Optionmenu/OverdueMenu";
import CompleteMenu from "@/components/Optionmenu/CompleteMenu";
import { IconClockOff, IconCalendarTime, IconCircle } from "@tabler/icons-react";
import AlertDialogSlide from "@/components/Feedback/AlertDialogSlide";
import UpdateTaskPopup from "@/components/UpdateTask/UpdateTaskPopup";
import classes from "./ActionsGrid.module.css";
import { getTasks, deleteTask } from "@/services/api";
import { Task } from "@/models/Task";
import { IconPlayerPlay, IconPlus } from "@tabler/icons-react";
import Image from 'next/image';
import TaskDetailsPopup from "@/components/AddTaskPopup/TaskDetailsPopup";
import AddTaskPopup from "@/components/AddTaskPopup/AddTaskPopup";
import { useAppContext } from "@/features/account/AppContext";


function ActionsGrid() {

  const renderEmptyState = (
    icon: React.ReactNode,
    message: string,
    customMarginLeft: string = "280px" // Default value for other messages
  ) => (
    <div style={{ textAlign: "center", marginLeft: customMarginLeft, color: "#4FC3F7" }}>
      <div style={{ fontSize: "48px", marginBottom: "10px" }}>{icon}</div>
      <Text size="sm" color="#4FC3F7">
        {message}
      </Text>
    </div>
  );

  const { user } = useAppContext();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskDetailPopupOpen, setTaskDetailPopupOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [updatePopupOpen, setUpdatePopupOpen] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [completedTask, setCompletedTask] = useState<{
    id: number;
    title: string;
  } | null>(null);
  useEffect(() => {
    if (completedTask) {
      fetchTasks();
    }
  }, [completedTask]);
  const [taskToUpdate, setTaskToUpdate] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const fetchedTasks = await getTasks(user as any);
      setTasks(fetchedTasks);
      setIsError(false);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setIsError(true);
    }
    setIsLoading(false);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setTaskDetailPopupOpen(true);
  };
  const handleCardClick = () => setPopupOpen(true);
  const handleClosePopup = () => {
    setPopupOpen(false);
    fetchTasks();
  };
  const handleComplete = (task: { id: number; title: string }) => {
    setCompletedTask(task);
    setConfettiActive(true);
    setTimeout(() => {
      setCompletedTask(null);
      setConfettiActive(false);
    }, 3000);
  };
  const handleDialogOpen = (task: { id: number; title: string }) => {
    setCurrentTask(task);
    setDialogOpen(true);
  };
  const handleDialogClose = (agree: boolean) => {
    setDialogOpen(false);
    if (agree && currentTask) {
      handleComplete(currentTask);
    }
    setCurrentTask(null);
  };
  const handleUpdateClick = (task: Task) => {
    setTaskToUpdate(task);
    setUpdatePopupOpen(true);
  };
  const handleUpdateClose = () => {
    setUpdatePopupOpen(false);
    setTaskToUpdate(null);
    fetchTasks();
  };

  const handleDelete = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      fetchTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);


  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading tasks.</div>;

  // Group tasks by status and label
  const groupByStatusAndLabel = (status: string) => {
    const tasksByLabel: { [label: string]: Task[] } = {};
    tasks?.forEach((task) => {
      if (task.status === status) {
        if (!tasksByLabel[task.label]) {
          tasksByLabel[task.label] = [];
        }
        tasksByLabel[task.label].push(task);
      }
    });
    return tasksByLabel;
  };
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const truncateString = (str: string, maxLength: number) => {
    return str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;
  };
  const overdueTasksByLabel = groupByStatusAndLabel("Overdue");
  const pendingTasksByLabel = groupByStatusAndLabel("pending");
  const completedTasksByLabel = groupByStatusAndLabel("completed");

  console.log(pendingTasksByLabel);

  return (
    <>
      <div className={classes.highlight_card}>
        <div className={classes.list_taskm}>
          <Card
            withBorder
            radius="10px"
            className={classes.card}
            onClick={handleCardClick}
          >
            <Group>
              <Image
                src="/add.svg"
                alt="Add Task Icon"
                className={classes.icon}
                width={24} // Define the width of the image
                height={24}
              />
              <Text className={classes.title}>Add Highlights</Text>
            </Group>
          </Card>
          <br />

          {/* Overdue Tasks Section */}
          <div className={classes.overduetitle}>
            <b>Over Due</b>
          </div>
          <div className={classes.overdue}>
          {Object.entries(overdueTasksByLabel).length === 0 ? (
    renderEmptyState(
      <IconClockOff size={158} color="#98dcfa" />,
      "No overdue tasks available.",
      "-30px" // Custom marginLeft for this message
    )
  ) : (

            Object.entries(overdueTasksByLabel).map(([label, tasks]) => (
              <div key={label} className={classes.labelSection}>
                <div className={classes.labelname}>
                  <b>{label}</b>
                </div>

                <div className={classes.button}>
                  {/* <Button
                    style={{ marginRight: "20px" }}
                    rightSection={<IconPlayerPlay size={16} />}
                  >
                    Start Focus
                  </Button> */}
                  {/* <Button
                    variant="outline"
                    rightSection={<IconPlus size={16} />}
                  >
                    Add Highlight
                  </Button> */}
                </div>
                {tasks.map((task) => (
                  <div key={task.id} className={classes.overduetask}>
                    <div className={classes.taskContainer}>
                      <div className={classes.sqare}>
                        <div
                          className={`flagIcon ${completedTask && completedTask.id === task.id
                            ? "completed"
                            : ""
                            }`}
                          onClick={() => handleDialogOpen(task)}
                        >
                          <FontAwesomeIcon
                            icon={
                              completedTask && completedTask.id === task.id
                                ? faSolidSquare
                                : faRegularSquare
                            }
                          />
                        </div>
                      </div>
                      <div className={classes.taskname} onClick={() => handleTaskClick(task)}>
                        <b>{truncateString(task.title, 14)}</b>
                      </div>
                      <div className={classes.taskstarttime}>
                        <b>{formatTime(task.startTime)}</b>
                      </div>
                      <div className={classes.taskendtime}>
                        <b>{formatTime(task.endTime)}</b>
                      </div>
                      <div className={classes.menu}>
                        <Overdue
                          onUpdateClick={() => handleUpdateClick(task)}
                          onDelete={() => handleDelete(task.id)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <br />
              </div>
            )))}
          </div>
        </div>

        <div className={classes.separator}></div>

        {/* Pending Tasks Section */}
        <div className={classes.list_task}>
          <div className={classes.Pendingtitle}>
            <b>Pending</b>
          </div>
          <div className={classes.pendingBox}>
          {Object.entries(pendingTasksByLabel).length === 0 ? (
             renderEmptyState(<IconCalendarTime size={158} color="#4FC3F7" />, "No pending tasks available.")
            ) :(
            Object.entries(pendingTasksByLabel).map(([label, tasks]) => (
              <div key={label} className={classes.labelSection}>
                <div className={classes.labelname}>
                  <b>{label}</b>
                </div>

                <div className={classes.button}>
                  {/* <Button
                    style={{ marginRight: "20px" }}
                    rightSection={<IconPlayerPlay size={16} />}
                  >
                    Start Focus
                  </Button> */}
                  {/* <Button
                    variant="outline"
                    rightSection={<IconPlus size={16} />}
                  >
                    Add Highlight
                  </Button> */}
                </div>
                {tasks.map((task) => (
                  <div key={task.id} className={classes.task}>
                    <div className={classes.taskContainer}>


                      <div className={classes.sqare}>
                        <div
                          className={`flagIcon ${completedTask && completedTask.id === task.id
                            ? "completed"
                            : ""
                            }`}
                          onClick={() => handleDialogOpen(task)}
                        >
                          <FontAwesomeIcon
                            icon={
                              completedTask && completedTask.id === task.id
                                ? faSolidSquare
                                : faRegularSquare
                            }
                          />
                        </div>
                      </div>

                      <div className={classes.taskname} onClick={() => handleTaskClick(task)}>
                        <b>{truncateString(task.title, 14)}</b>
                      </div>

                      <div className={classes.taskstarttime}>
                        <b>{formatTime(task.startTime)}</b>
                      </div>
                      <div className={classes.taskendtime}>
                        <b>{formatTime(task.endTime)}</b>
                      </div>

                      <div className={classes.menu}>
                        <OptionsMenu
                          onUpdateClick={() => handleUpdateClick(task)}
                          onDelete={() => handleDelete(task.id)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <br />
              </div>
            )))}
          </div>

          {/* Completed Tasks Section */}
          <div className={classes.completetitle}>
            <b>Completed</b>
          </div>
          <div className={classes.completed}>
          {Object.entries(completedTasksByLabel).length === 0 ? (
    renderEmptyState(<IconCircle size={158} color="#98dcfa" />, "No completed tasks available.")
  ) : (
            Object.entries(completedTasksByLabel).map(([label, tasks]) => (
              <div key={label} className={classes.labelSection}>
                <div className={classes.labelname}>
                  <b>{label}</b>
                </div>
                <div className={classes.button}>
                  {/* <Button
                    style={{ marginRight: "20px" }}
                    rightSection={<IconPlayerPlay size={16} />}
                  >
                    Start Focus
                  </Button> */}
                  {/* <Button
                    variant="outline"
                    rightSection={<IconPlus size={16} />}
                  >
                    Add Highlidght
                  </Button> */}
                </div>
                {tasks.map((task) => (
                  <div key={task.id} className={classes.completedtask}>
                    <div className={classes.taskContainer}>
                      <div className={classes.sqare}>
                        <div
                          className={`flagIcon ${completedTask && completedTask.id === task.id
                            ? "completed"
                            : ""
                            }`}
                          onClick={() => handleDialogOpen(task)}
                        >
                          {/* <FontAwesomeIcon
                            icon={
                              completedTask && completedTask.id === task.id
                                ? faSolidSquare
                                : faRegularSquare
                            }
                          /> */}
                        </div>
                      </div>
                      <div className={classes.taskname} onClick={() => handleTaskClick(task)}>
                        <b>{truncateString(task.title, 14)}</b>
                      </div>
                      <div className={classes.taskstarttime}>
                        <b>{formatTime(task.startTime)}</b>
                      </div>
                      <div className={classes.taskendtime}>
                        <b>{formatTime(task.endTime)}</b>
                      </div>
                      <div className={classes.menu}>
                        <CompleteMenu
                          onUpdateClick={() => handleUpdateClick(task)}
                          onDelete={() => handleDelete(task.id)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <br />
              </div>
            )))}
          </div>
        </div>
      </div>
      {/* {selectedTask && (
  <Detailspopup task={selectedTask} opened={true} onClose={() => setSelectedTask(null)} />
)} */}

      <AddTaskPopup open={popupOpen} onClose={handleClosePopup} />
      {confettiActive && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
        />
      )}
      {completedTask && (
        <div className={classes.completedMessage}>
          <p>{`Completed: ${completedTask.title}`}</p>
        </div>
      )}

      {selectedTask && (
        <TaskDetailsPopup
          task={selectedTask}
          opened={taskDetailPopupOpen}
          onClose={() => {
            setSelectedTask(null);
            setTaskDetailPopupOpen(false);
          }}
        />
      )}
      {currentTask && (
        <AlertDialogSlide
          open={dialogOpen}
          handleClose={handleDialogClose}
          taskId={currentTask.id.toString()}
        />
      )}    {taskToUpdate && (
        <UpdateTaskPopup
          open={updatePopupOpen}
          onClose={handleUpdateClose}
          task={taskToUpdate}
          onUpdate={(updatedTask) => {
            console.log("Updated Task:", updatedTask);
          }}
        />
      )}
    </>
  );
}

export default function Highlights() {
  return (
    <>
      <ActionsGrid />
    </>
  );
}

Highlights.getLayout = function getLayout(page: ReactNode) {
  return <PageLayout>{page}</PageLayout>;
};
