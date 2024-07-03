import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Menu, MenuItem } from '@mui/material';
import styles from './DaySchedule.module.css';

// Define types for Task and Subtask
interface Subtask {
  id: string;
  title: string;
  time: string;
}

interface Task {
  id: string;
  title: string;
  time: string;
  subtasks: Subtask[];
}

const DaySchedule: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Learning Ballerina',
      time: '8.00 am - 10.00 am',
      subtasks: [
        { id: '1', title: 'Setup environment', time: '8.00 am' },
        { id: '2', title: 'Build components', time: '9.00 am' }
      ]
    },
    {
      id: '2',
      title: 'Learning React',
      time: '10.00 am - 12.00 pm',
      subtasks: [
        { id: '1', title: 'Setup environment', time: '10.00 am' },
        { id: '2', title: 'Build components', time: '11.00 am' }
      ]
    },
    {
      id: '3',
      title: 'Exercise',
      time: '3.00 pm - 4.00 pm',
      subtasks: []
    }
  ]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newTasks = Array.from(tasks);
    const [reorderedItem] = newTasks.splice(result.source.index, 1);
    newTasks.splice(result.destination.index, 0, reorderedItem);

    setTasks(newTasks);
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedSubtask, setSelectedSubtask] = useState<Subtask | null>(null);

  const handleTaskMenuOpen = (event: React.MouseEvent<HTMLElement>, task: Task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
    setSelectedSubtask(null); // Reset selected subtask
  };

  const handleSubtaskMenuOpen = (event: React.MouseEvent<HTMLElement>, task: Task, subtask: Subtask) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
    setSelectedSubtask(subtask);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTask(null);
    setSelectedSubtask(null);
  };

  const handleEditTask = () => {
    // Implement edit task functionality
    handleMenuClose();
  };

  const handleDeleteTask = () => {
    // Implement delete task functionality
    const updatedTasks = tasks.filter((task) => task.id !== selectedTask?.id);
    setTasks(updatedTasks);
    handleMenuClose();
  };

  const handleEditSubtask = () => {
    // Implement edit subtask functionality
    handleMenuClose();
  };

  const handleDeleteSubtask = () => {
    // Implement delete subtask functionality
    const updatedSubtasks = selectedTask?.subtasks.filter(
      (subtask) => subtask.id !== selectedSubtask?.id
    ) || [];
    const updatedTasks = tasks.map((task) => {
      if (task.id === selectedTask?.id) {
        return { ...task, subtasks: updatedSubtasks };
      }
      return task;
    });
    setTasks(updatedTasks);
    handleMenuClose();
  };

    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={styles.calendarContainer}>
          <h1 className={styles.titleCaption}>Today Schedule</h1>
          <div className={styles.container}>
            <div className={styles.tasks}>
              {tasks.map((task) => (
                <div key={task.id} className={styles.taskContainer}>
                  <div className={styles.task}>
                    <input type="checkbox" className={styles.checkbox} />
                    <div className={styles.taskDetails}>
                      <span className={styles.taskTitle}>{task.title}</span>
                      <span className={styles.taskTime}>{task.time}</span>
                    </div>
                    <button
                      onClick={(event) => handleTaskMenuOpen(event, task)}
                      className={styles.menuButton}
                    >
                      ...
                    </button>
                  </div>
                  <Droppable droppableId={`subtasks-${task.id}`} type="SUBTASK">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={styles.subtasks}
                      >
                        {task.subtasks.map((subtask, subIndex) => (
                          <Draggable
                            key={subtask.id}
                            draggableId={`subtask-${subtask.id}`}
                            index={subIndex}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={styles.subtask}
                              >
                                <input
                                  type="checkbox"
                                  className={styles.checkbox}
                                />
                                <div className={styles.taskDetails}>
                                  <span className={styles.taskTitle}>{subtask.title}</span>
                                  <span className={styles.taskTime}>{subtask.time}</span>
                                </div>
                                <button
                                  onClick={(event) => handleSubtaskMenuOpen(event, task, subtask)}
                                  className={styles.menuButton}
                                >
                                  ...
                                </button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {selectedSubtask ? (
            <MenuItem onClick={handleEditSubtask}>Edit Subtask</MenuItem>
          ) : (
            <>
              <MenuItem onClick={handleEditTask}>Edit Task</MenuItem>
              <MenuItem onClick={handleDeleteTask}>Delete Task</MenuItem>
            </>
          )}
          {selectedSubtask && (
            <MenuItem onClick={handleDeleteSubtask}>Delete Subtask</MenuItem>
          )}
        </Menu>
      </DragDropContext>
    );
    

};

export default DaySchedule;
