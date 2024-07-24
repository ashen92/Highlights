import React, { ReactNode, useState } from 'react';
import { Card, Group, Text, useMantineTheme } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare as faRegularSquare } from '@fortawesome/free-regular-svg-icons';
import { faCheckSquare as faSolidSquare } from '@fortawesome/free-solid-svg-icons';

import Confetti from 'react-confetti';
import PageLayout from "@/components/PageLayout";
import Addtask_popup from "@/components/AddTask/AddtaskPopup";
import OptionsMenu from "@/components/Optionmenu/OptionPopup";
import AlertDialogSlide from "@/components/Feedback/AlertDialogSlide";
import classes from "./ActionsGrid.module.css";

function ActionsGrid() {
  const theme = useMantineTheme();

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Task 1",
      description: "Description for task 1",
      date: "2024-07-03",
      subTasks: [
        { id: 1, title: "Sub-task 1.1", date: "2024-07-03" },
        { id: 2, title: "Sub-task 1.2", date: "2024-07-03" }
      ]
    },
    {
      id: 2,
      title: "Task 2",
      description: "Description for task 2",
      date: "2024-07-03",
      subTasks: [
        { id: 3, title: "Sub-task 2.1", date: "2024-07-03" },
        { id: 4, title: "Sub-task 2.2", date: "2024-07-03" }
      ]
    },
    {
      id: 3,
      title: "Task 3",
      description: "Description for task 3",
      date: "2024-07-03",
      subTasks: [
        { id: 5, title: "Sub-task 3.1", date: "2024-07-03" },
        { id: 6, title: "Sub-task 3.2", date: "2024-07-03" }
      ]
    }
  ]);

  const [popupOpen, setPopupOpen] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<{ id: number, title: string } | null>(null);
  const [completedTask, setCompletedTask] = useState<{ id: number, title: string } | null>(null);

  const handleCardClick = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  const handleComplete = (task: { id: number, title: string }) => {
    setCompletedTask(task);
    setConfettiActive(true);
    setTimeout(() => {
      setCompletedTask(null);
      setConfettiActive(false);
    }, 3000);
  };

  const handleDialogOpen = (task: { id: number, title: string }) => {
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

  const addTask = (newTask: any) => {
    // Add the new task to the tasks array
    setTasks([...tasks, newTask]);
    setPopupOpen(false); // Close the popup after adding the task
  };

  return (
    <>
      <div className={classes.highlight_card}>
        <Card withBorder radius="10px" className={classes.card} onClick={handleCardClick}>
          <Group>
            <img
              src="/add-plus-svgrepo-com (1).svg"
              alt="Add Task Icon"
              className={classes.icon}
            />
            <Text className={classes.title}>Add Highlights</Text>
          </Group>
        </Card>
        <div className={classes.separator}></div>

        <div className={classes.list_task}>
          {tasks.map((task) => (
            <div key={task.id}>
              <div className={classes.d}>
                <div className={classes.task}>
                  <div
                    className={`${classes.flag_icon} ${completedTask && completedTask.id === task.id ? classes.completed : ''}`}
                    onClick={() => handleDialogOpen(task)}
                  >
                    <FontAwesomeIcon icon={completedTask && completedTask.id === task.id ? faSolidSquare : faRegularSquare} />
                  </div>
                  <div className={classes.task_name}>
                    <h3>{task.title}</h3>
                    <div className={classes.task_date}>
                      <p>{task.date}</p>
                    </div>
                  </div>
                </div>
                <div className={classes.bars_icon}>
                  <OptionsMenu onOpenPopup={handleCardClick} />
                </div>
              </div>
              {task.subTasks.map((subTask) => (
                <div key={subTask.id} className={`${classes.d} ${classes.subTask}`}>
                  <div className={classes.task}>
                    <div
                      className={`${classes.flag_icon} ${completedTask && completedTask.id === subTask.id ? classes.completed : ''}`}
                      onClick={() => handleDialogOpen(subTask)}
                    >
                      <FontAwesomeIcon icon={completedTask && completedTask.id === subTask.id ? faSolidSquare : faRegularSquare} />
                    </div>
                    <div className={classes.task_name}>
                      <h3>{subTask.title}</h3>
                      <div className={classes.task_date}>
                        <p>{subTask.date}</p>
                      </div>
                    </div>
                  </div>
                  <div className={classes.bars_icon}>
                    <OptionsMenu onOpenPopup={handleCardClick} />
                  </div>
                </div>
              ))}
              <br />
            </div>
          ))}
        </div>
      </div>

      <Addtask_popup open={popupOpen} onClose={handleClosePopup} addTask={addTask} />

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

      <AlertDialogSlide open={dialogOpen} handleClose={handleDialogClose} />
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
