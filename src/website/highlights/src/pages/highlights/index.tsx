
import PageLayout from "@/components/PageLayout";
import { Card, Text, Group, useMantineTheme } from "@mantine/core";
import { ReactNode, useState } from "react";
import classes from "./ActionsGrid.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare as faRegularSquare } from "@fortawesome/free-regular-svg-icons";
import Addtask_popup from "@/components/Addtask_popup";
import OptionsMenu from "@/components/Option_popup";
import Confetti from "react-confetti";

function ActionsGrid() {
  const theme = useMantineTheme();
  const tasks = [
    { id: 1, title: "Task 1", description: "Description for task 1" },
    { id: 2, title: "Task 2", description: "Description for task 2" },
    { id: 3, title: "Task 3", description: "Description for task 3" },
  ];
  const [popupOpen, setPopupOpen] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);

  // State to track which task has been completed
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
      setCompletedTask(null); // Reset completed task
      setConfettiActive(false);
    }, 3000);
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
                  <div className={classes.flag_icon} onClick={() => handleComplete(task)}>
                    <FontAwesomeIcon icon={faRegularSquare} />
                  </div>
                  <div className={classes.task_name}>
                    <h2>{task.title}</h2>
                  </div>
                </div>
                <div className={classes.bars_icon}>
                  <OptionsMenu onOpenPopup={handleCardClick} />
                </div>
              </div>
              <br />
            </div>
          ))}
        </div>
      </div>

      <Addtask_popup open={popupOpen} onClose={handleClosePopup} />

      {confettiActive && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
        />
      )}

      {/* Display completed message in the middle */}
      {completedTask && (
        <div className={classes.completedMessage}>
          <p>{`Completed: ${completedTask.title}`}</p>
        </div>
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
