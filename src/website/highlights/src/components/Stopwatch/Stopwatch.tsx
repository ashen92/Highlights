import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { Group, TextInput, Text, Menu, UnstyledButton, Tabs, Avatar, Button } from '@mantine/core';
import { IconInfoCircle, IconChevronRight, IconCalendarDue, IconHourglassHigh } from '@tabler/icons-react';
import { showNotification } from '@mantine/notifications';
import Swal from 'sweetalert';
import styles from './Stopwatch.module.css';
import { useHighlights } from "@/hooks/useHighlights";
import { useTimers } from '@/hooks/useTimer';
import { HighlightTask } from "@/models/HighlightTask";
import { mTimer } from '@/models/Timer';
import { getActiveStopwatchHighlightDetails, getActiveTimerHighlightDetails, sendContinueStopwatchData, sendEndStopwatchData, sendPauseStopwatchData, sendStartStopwatchData } from '@/services/api';
import FocusSummary from '../FocusSummary/FocusSummary';



interface UserButtonProps {
  image?: string;
  label: string;
  icon?: React.ReactNode;
  [key: string]: any;
}
interface StopwatchProps {
  onEndButtonClick: () => void; // Prop to notify end button click
}
const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
  ({ image, label, icon, ...others }, ref) => (
    <UnstyledButton
      ref={ref}
      style={{
        padding: 'var(--mantine-spacing-md)',
        color: 'var(--mantine-color-text)',
        borderRadius: 'var(--mantine-radius-sm)',
      }}
      {...others}
    >
      <Group>
        {image && <Avatar src={image} radius="xl" />}
        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {label}
          </Text>
        </div>
        {icon || <IconChevronRight size="1rem" />}
      </Group>
    </UnstyledButton>
  )
);

UserButton.displayName = 'UserButton'; // Setting the displayName to satisfy react/display-name rule

const HighlightMenu = ({ highlights, onHighlightSelect, closeMenu }: { highlights: HighlightTask[], onHighlightSelect: (index: number) => void, closeMenu: () => void }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHighlights = highlights.filter((highlight) =>
    highlight.highlight_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (index: number) => {
    onHighlightSelect(index);
    closeMenu();
  };


  return (
    <Tabs.Panel value="Task">
      <div className={styles.taskContainer}>
        <TextInput
          placeholder="Search"
          className={styles.searchInput}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.currentTarget.value)}
        />
        <div className={styles.taskHeader}>
          <Text className={styles.today}><IconCalendarDue />Today &gt;</Text>
        </div>
        <Menu>
          {filteredHighlights.map((highlight, index) => (
            <Menu.Item key={highlight.id} onClick={() => handleSelect(index)}>
              {highlight.highlight_name}
            </Menu.Item>
          ))}
        </Menu>
      </div>
    </Tabs.Panel>
  );
};

const TimerMenu = ({ timer_details }: { timer_details: mTimer[] }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTimers = timer_details.filter((timer) =>
    timer.timer_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Tabs.Panel value="Timer">
      <div className={styles.taskContainer}>
        <TextInput
          placeholder="Search"
          className={styles.searchInput}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.currentTarget.value)}
        />
        <div className={styles.taskHeader}>
          <Text className={styles.today}><IconHourglassHigh /></Text>
        </div>
        <Menu>
          {filteredTimers.map((timer) => (
            <Menu.Item key={timer.timer_id}>{timer.timer_name}</Menu.Item>
          ))}
        </Menu>
      </div>
    </Tabs.Panel>
  );
};
const Stopwatch: React.FC<StopwatchProps> = ({ onEndButtonClick }) => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [opened, setOpened] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const [selectedTask, setSelectedTask] = useState<number | null>(null); // State to track selected task
  const { highlights, isHighlightsLoading, isHighlightsError } = useHighlights();
  const { timer_details, istimer_detailsLoading, istimer_detailsError } = useTimers();
  const [menuOpened, setMenuOpened] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [pauseTime, setPauseTime] = useState<Date | null>(null);
  const [continueTime, setContinueTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [stopwatchId, setStopwatchId] = useState<number | null>(null);
  const [highlightId, setHighlightId] = useState<number | null>(null);
  const [showFocusSummary, setShowFocusSummary] = useState(false);


  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = window.setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (isPaused && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused]);

  useEffect(() => {
    // Reset the showFocusSummary state on page load or component mount
    setShowFocusSummary(false);
  }, []);

  const handleStart = async () => {
    setIsActive(true);
    setIsPaused(false);

    const startTime = new Date();
    setStartTime(startTime);


    const startDetails = {
      timer_id: 1,
      highlight_id: selectedTask !== null ? Number(selectedTask) : -1,
      user_id: 1, // Replace with the actual user ID
      start_time: startTime.toISOString(),
      status: "uncomplete"
    };

    try {
      await sendStartStopwatchData(startDetails);

      const response = await getActiveStopwatchHighlightDetails(startDetails.user_id); // Replace with the actual user ID
      const { stopwatch_id, highlight_id } = response[0];
      setStopwatchId(stopwatch_id);
      setHighlightId(highlight_id);

      showNotification({
        title: 'Timer Started',
        message: 'The timer has started and start time details have been sent.',
        icon: <IconInfoCircle />,
        color: 'blue',
        autoClose: 3000,
        radius: 'md',
        styles: (theme) => ({
          root: {
            backgroundColor: theme.colors.blue[6],
            borderColor: theme.colors.blue[6],
            '&::before': { backgroundColor: theme.white },
          },
          title: { color: theme.white },
          description: { color: theme.white },
          closeButton: {
            color: theme.white,
            '&:hover': { backgroundColor: theme.colors.blue[7] },
          },
        }),
      });
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to send start time details.',
        icon: <IconInfoCircle />,
        color: 'red',
        autoClose: 3000,
        radius: 'md',
        styles: (theme) => ({
          root: {
            backgroundColor: theme.colors.red[6],
            borderColor: theme.colors.red[6],
            '&::before': { backgroundColor: theme.white },
          },
          title: { color: theme.white },
          description: { color: theme.white },
          closeButton: {
            color: theme.white,
            '&:hover': { backgroundColor: theme.colors.red[7] },
          },
        }),
      });
    }
  };

  const handlePause = async () => {
    const pauseTime = new Date(); 
    setIsPaused(true);
  
    const currentTimerId = selectedTask !== null && timer_details
      ? Number(timer_details[selectedTask]?.timer_id) // Convert to number
      : -1; // Default value or handle as needed
  
    const userId = 1;
  
    
    const pauseDetails = {
      stopwatch_id: stopwatchId ?? 1,
      timer_id: 1,
      highlight_id: highlightId ?? 1,
      user_id: userId,
      pause_time: pauseTime.toISOString(),
    };
  
    try {
      
      await sendPauseStopwatchData(pauseDetails);
  
      showNotification({
        title: 'Paused',
        message: 'The pause time has been recorded and sent to the backend.',
        icon: <IconInfoCircle />,
        color: 'blue',
        autoClose: 3000,
        radius: 'md',
        styles: (theme) => ({
          root: {
            backgroundColor: theme.colors.blue[6],
            borderColor: theme.colors.blue[6],
            '&::before': { backgroundColor: theme.white },
          },
          title: { color: theme.white },
          description: { color: theme.white },
          closeButton: {
            color: theme.white,
            '&:hover': { backgroundColor: theme.colors.blue[7] },
          },
        }),
      });
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to send pause time details.',
        icon: <IconInfoCircle />,
        color: 'red',
        autoClose: 3000,
        radius: 'md',
        styles: (theme) => ({
          root: {
            backgroundColor: theme.colors.red[6],
            borderColor: theme.colors.red[6],
            '&::before': { backgroundColor: theme.white },
          },
          title: { color: theme.white },
          description: { color: theme.white },
          closeButton: {
            color: theme.white,
            '&:hover': { backgroundColor: theme.colors.red[7] },
          },
        }),
      });
    }
  };
  

  const handleContinue = async () => {
    const continueTime = new Date(); 
    setIsPaused(false);
  
    const currentTimerId = selectedTask !== null && timer_details
      ? Number(timer_details[selectedTask]?.timer_id) // Convert to number
      : -1; // Default value or handle as needed
  
    const userId = 1;
  
    const continueDetails = {
      stopwatch_id: stopwatchId ?? 1,
      timer_id: 1,
      highlight_id: highlightId ?? 1,
      user_id: userId,
      continue_time: continueTime.toISOString(),
    };
  
    try {
      
      await sendContinueStopwatchData(continueDetails);
  
      showNotification({
        title: 'Continued',
        message: 'The continue time has been recorded and sent to the backend.',
        icon: <IconInfoCircle />,
        color: 'blue',
        autoClose: 3000,
        radius: 'md',
        styles: (theme) => ({
          root: {
            backgroundColor: theme.colors.blue[6],
            borderColor: theme.colors.blue[6],
            '&::before': { backgroundColor: theme.white },
          },
          title: { color: theme.white },
          description: { color: theme.white },
          closeButton: {
            color: theme.white,
            '&:hover': { backgroundColor: theme.colors.blue[7] },
          },
        }),
      });
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to send continue time details.',
        icon: <IconInfoCircle />,
        color: 'red',
        autoClose: 3000,
        radius: 'md',
        styles: (theme) => ({
          root: {
            backgroundColor: theme.colors.red[6],
            borderColor: theme.colors.red[6],
            '&::before': { backgroundColor: theme.white },
          },
          title: { color: theme.white },
          description: { color: theme.white },
          closeButton: {
            color: theme.white,
            '&:hover': { backgroundColor: theme.colors.red[7] },
          },
        }),
      });
    }
  };
  


  //   Swal({
  //     title: "Is the task complete?",
  //     text: "Please confirm if you have completed the task.",
  //     icon: "warning",
  //     buttons: ["Not Yet", "Yes, Complete!"],
  //     dangerMode: true,
  //   }).then(async (isComplete) => {
  //     const endTime = new Date();
  //     setEndTime(endTime);
  
  //     const currentTimerId = selectedTask !== null && timer_details
  //       ? Number(timer_details[selectedTask]?.timer_id) // Convert to number
  //       : -1; // Default value or handle as needed
  
  //     const userId = 11;

  //     const status = isComplete ? "complete" : "uncomplete";
  
  //     const endDetails = {
  //       stopwatch_id: stopwatchId ?? 1,
  //       timer_id: currentTimerId,
  //       highlight_id: highlightId ?? 1,
  //       user_id: userId,
  //       end_time: endTime.toISOString(),
  //       status: status
  //     };
  
  //     try {
        
  //       await sendEndStopwatchData(endDetails);

  //       setShowFocusSummary(true);
  
  //       const notificationTitle = isComplete ? 'Task Completed' : 'Task Not Completed';
  //       const notificationMessage = isComplete
  //         ? 'The task has been marked as complete, and the end time has been sent.'
  //         : 'The task has been marked as uncomplete, and the end time has been sent.';
  //       const notificationColor = isComplete ? 'blue' : 'yellow';
  
  //       showNotification({
  //         title: notificationTitle,
  //         message: notificationMessage,
  //         icon: <IconInfoCircle />,
  //         color: notificationColor,
  //         autoClose: 3000,
  //         radius: 'md',
  //         styles: (theme) => ({
  //           root: {
  //             backgroundColor: theme.colors[notificationColor][6],
  //             borderColor: theme.colors[notificationColor][6],
  //             '&::before': { backgroundColor: theme.white },
  //           },
  //           title: { color: theme.white },
  //           description: { color: theme.white },
  //           closeButton: {
  //             color: theme.white,
  //             '&:hover': { backgroundColor: theme.colors[notificationColor][7] },
  //           },
  //         }),
  //       });
  //       setShowFocusSummary(true);
  //     } catch (error) {
  //       showNotification({
  //         title: 'Error',
  //         message: 'Failed to send end time details.',
  //         icon: <IconInfoCircle />,
  //         color: 'red',
  //         autoClose: 3000,
  //         radius: 'md',
  //         styles: (theme) => ({
  //           root: {
  //             backgroundColor: theme.colors.red[6],
  //             borderColor: theme.colors.red[6],
  //             '&::before': { backgroundColor: theme.white },
  //           },
  //           title: { color: theme.white },
  //           description: { color: theme.white },
  //           closeButton: {
  //             color: theme.white,
  //             '&:hover': { backgroundColor: theme.colors.red[7] },
  //           },
  //         }),
  //       });
  //     }
  
  //     // Reset stopwatch
  //     setIsActive(false);
  //     setIsPaused(false);
  //     setTime(0);
  //   });
  // };
  const handleEnd = () => {
    Swal({
      title: "Is the task complete?",
      text: "Please confirm if you have completed the task.",
      icon: "warning",
      buttons: ["Not Yet", "Yes, Complete!"],
      dangerMode: true,
    }).then(async (isComplete) => {
      const endTime = new Date();
      setEndTime(endTime);

      const currentTimerId = selectedTask !== null && timer_details
        ? Number(timer_details[selectedTask]?.timer_id) // Convert to number
        : -1; // Default value or handle as needed

      const userId = 1;

      const status = isComplete ? "complete" : "uncomplete";

      const endDetails = {
        stopwatch_id: stopwatchId ?? 1,
        timer_id: 1,
        highlight_id: highlightId ?? 1,
        user_id: userId,
        end_time: endTime.toISOString(),
        status: status
      };

      try {
        await sendEndStopwatchData(endDetails);

        // Notify parent component to refresh FocusSummary
        onEndButtonClick();

        const notificationTitle = isComplete ? 'Task Completed' : 'Task Not Completed';
        const notificationMessage = isComplete
          ? 'The task has been marked as complete, and the end time has been sent.'
          : 'The task has been marked as uncomplete, and the end time has been sent.';
        const notificationColor = isComplete ? 'blue' : 'yellow';

        showNotification({
          title: notificationTitle,
          message: notificationMessage,
          icon: <IconInfoCircle />,
          color: notificationColor,
          autoClose: 3000,
          radius: 'md',
          styles: (theme) => ({
            root: {
              backgroundColor: theme.colors[notificationColor][6],
              borderColor: theme.colors[notificationColor][6],
              '&::before': { backgroundColor: theme.white },
            },
            title: { color: theme.white },
            description: { color: theme.white },
            closeButton: {
              color: theme.white,
              '&:hover': { backgroundColor: theme.colors[notificationColor][7] },
            },
          }),
        });

        setShowFocusSummary(true);
      } catch (error) {
        showNotification({
          title: 'Error',
          message: 'Failed to send end time details.',
          icon: <IconInfoCircle />,
          color: 'red',
          autoClose: 3000,
          radius: 'md',
          styles: (theme) => ({
            root: {
              backgroundColor: theme.colors.red[6],
              borderColor: theme.colors.red[6],
              '&::before': { backgroundColor: theme.white },
            },
            title: { color: theme.white },
            description: { color: theme.white },
            closeButton: {
              color: theme.white,
              '&:hover': { backgroundColor: theme.colors.red[7] },
            },
          }),
        });
      }

      // Reset stopwatch
      setIsActive(false);
      setIsPaused(false);
      setTime(0);
    });
  };



  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progress = (time % 2100) / 2100; // 35 minutes * 60 seconds
  const offset = circumference - progress * circumference;

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const handleHighlightSelect = (index: number) => {
    setSelectedTask(index);
    setMenuOpened(false);
  };

  return (
    <div className={styles.stopwatch}>
      <div>
        <div className={styles.focusLink}>
          <Menu withArrow opened={menuOpened} onChange={setMenuOpened}>
            <Menu.Target>
              <UserButton
                label={selectedTask !== null && highlights ? highlights[selectedTask]?.highlight_name : "Focus"}
                styles={{
                  label: {
                    fontSize: '14px',
                  },
                }}
              />
            </Menu.Target>
            <Menu.Dropdown>
              <Tabs variant="outline" defaultValue="Task">
                <Tabs.List>
                  <Tabs.Tab value="Task">Task</Tabs.Tab>
                  <Tabs.Tab value="Timer">Timer</Tabs.Tab>
                </Tabs.List>
                {highlights ? (
                  <HighlightMenu highlights={highlights} onHighlightSelect={handleHighlightSelect} closeMenu={() => setMenuOpened(false)} />
                ) : null}
                {timer_details ? <TimerMenu timer_details={timer_details} /> : null}
              </Tabs>
            </Menu.Dropdown>
          </Menu>
        </div>
        <svg className={styles.svg} viewBox="0 0 200 200">
          <circle
            className={styles.circleBackground}
            cx="100"
            cy="100"
            r={radius}
          />
          <circle
            className={styles.circleProgress}
            cx="100"
            cy="100"
            r={radius}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
            }}
          />
          <g transform="rotate(90, 100, 100)">
            <text x="100" y="105" textAnchor="middle" className={styles.time}>
              {formattedTime}
            </text>
          </g>
        </svg>
        <div className={styles.buttons}>
          {!isActive && (
            <button className={styles.startButton} onClick={handleStart}>Start</button>
          )}
          {isActive && !isPaused && (
            <>
              <button className={styles.pauseButton} onClick={handlePause}>Pause</button>
              <button className={styles.endButton} onClick={handleEnd}>End</button>
            </>
          )}
          {isPaused && (
            <>
              <button className={styles.continueButton} onClick={handleContinue}>Continue</button>
              <button className={styles.endButton} onClick={handleEnd}>End</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stopwatch;
