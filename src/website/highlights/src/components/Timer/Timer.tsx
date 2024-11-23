import React, { useState, useEffect, forwardRef, useCallback } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { showNotification } from '@mantine/notifications';
import { IconInfoCircle, IconChevronRight, IconCalendarDue, IconHourglassHigh } from '@tabler/icons-react';
import { Group, Avatar, Text, Menu, UnstyledButton, TextInput, Tabs, Modal, Button } from '@mantine/core';
import styles from './Timer.module.css';
import { useHighlights } from "@/hooks/useHighlights";
import { useTimers } from '@/hooks/useTimer';
// import { useAppUser } from '@/hooks/useAppUser';
import { HighlightTask } from "@/models/HighlightTask";
import { mTimer, ActiveHighlightDetails } from '@/models/Timer';
import { sendTimerEndData, sendPauseData, sendContinueData, sendStartTimeData, getActiveTimerHighlightDetails } from "@/services/api";
import Swal from 'sweetalert2';
import { useAppContext } from '@/features/account/AppContext';

interface UserButtonProps {
  image?: string;
  label: string;
  icon?: React.ReactNode;
  styles?: {
    label?: {
      fontSize?: string;
    };
  };
  onClick?: () => void;
}
interface TimerProps {
  onEndButtonClick: () => void; // Prop to notify end button click
}

const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
  ({ image, label, icon, styles: userStyles, onClick, ...others }: UserButtonProps, ref) => {
    return (
      <UnstyledButton
        ref={ref}
        className={styles.userButton}
        onClick={onClick}
        {...others}
      >
        <Group>
          {image && <Avatar src={image} radius="xl" />}

          <div className={styles.userButtonLabel}>
            <Text size="sm" fw={500} style={userStyles?.label}>
              {label}
            </Text>
          </div>

          {icon || <IconChevronRight size="1rem" />}
        </Group>
      </UnstyledButton>
    );
  }
);
UserButton.displayName = "UserButton";

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
          <Text className={styles.today}><IconCalendarDue /> Today &gt;</Text>
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


const Timer: React.FC<TimerProps> = ({ onEndButtonClick }) => {
  const WORK_TIME = 25;
  const SHORT_BREAK = 5;
  const LONG_BREAK = 15;
  const CYCLES_BEFORE_LONG_BREAK = 4;

  const [active, setActive] = useState('focus'); // 'focus' for work session, 'break' for break session
  const [minCount, setMinCount] = useState(WORK_TIME); // Initial time is set to WORK_TIME
  const [count, setCount] = useState(0); // Seconds count within the current minute
  const [paused, setPaused] = useState(false); // Timer paused state
  const [started, setStarted] = useState(false); // Timer started state
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null); // Timer ID for setInterval
  const [cycles, setCycles] = useState(0); // Number of completed work cycles
  const [selectedTask, setSelectedTask] = useState<number | null>(null); // State to track selected task
  const { highlights, isHighlightsLoading, isHighlightsError } = useHighlights();
  const { timer_details, istimer_detailsLoading, istimer_detailsError } = useTimers();
  // const { user } = useAppUser();
  const [menuOpened, setMenuOpened] = useState(false);
  const [modalOpened, setModalOpened] = useState(false); // State for modal visibility
  const [startTime, setStartTime] = useState<Date | null>(null); // State to track start time
  const [pomoId, setPomoId] = useState<number | null>(null);
  const [highlightId, setHighlightId] = useState<number | null>(null);
  const [activeHighlights, setActiveHighlights] = useState<ActiveHighlightDetails[]>([]);
  const { user } = useAppContext();


  // const userId = user.id;
  const userId = Number(user.id);

  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };



  useEffect(() => {
    // Fetch active highlight details when the component mounts
    fetchActiveHighlightDetails(userId);
  }, []);

  const fetchActiveHighlightDetails = async (userId: number) => {
    try {
      const details = await getActiveTimerHighlightDetails(userId);
      setActiveHighlights(details);
    } catch (error) {
      console.error('Error fetching active timer highlight details:', error);
    }
  };



  const pauseTimer = async () => {
    if (active === 'focus') {

      setPaused(true);
      if (timerId) clearInterval(timerId);

      const currentTimerId = selectedTask !== null && timer_details
        ? Number(timer_details[selectedTask]?.timer_id)
        : -1;

      const pause_time = new Date();
      const pauseDetails = {
        pomo_id: pomoId ?? 0,
        highlight_id: highlightId ?? 1,
        pause_time: pause_time.toISOString(),
      };
      console.log(pauseDetails);

      try {
        await sendPauseData(pauseDetails);
        showNotification({
          title: 'Timer Paused',
          message: 'The timer has been paused and details have been sent.',
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
          message: 'Failed to send pause details.',
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

    } else {


      setPaused(true);
      if (timerId) clearInterval(timerId);

      const currentTimerId = selectedTask !== null && timer_details
        ? Number(timer_details[selectedTask]?.timer_id)
        : -1;


      try {
        showNotification({
          title: 'Timer Paused',
          message: 'The timer has been paused and details have been sent.',
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
          message: 'Failed to send pause details.',
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

    }

  };



  const startTimer = async () => {
    console.log("user",userId);
    console.log("timer_details", timer_details);
    setStarted(true);

    if (active === 'focus') {
      if (paused) {
        setPaused(false);

        const continueTime = new Date();
        setStartTime(continueTime);

        const continueDetails = {
          pomo_id: pomoId ?? 0,
          highlight_id: highlightId ?? 1,
          continue_time: continueTime.toISOString(),
        };

        try {
          await sendContinueData(continueDetails);
          showNotification({
            title: 'Timer Continued',
            message: 'The timer has been continued and details have been sent.',
            icon: <IconInfoCircle />,
            color: 'green',
            autoClose: 3000,
            radius: 'md',
            styles: (theme) => ({
              root: {
                backgroundColor: theme.colors.green[6],
                borderColor: theme.colors.green[6],
                '&::before': { backgroundColor: theme.white },
              },
              title: { color: theme.white },
              description: { color: theme.white },
              closeButton: {
                color: theme.white,
                '&:hover': { backgroundColor: theme.colors.green[7] },
              },
            }),
          });
        } catch (error) {
          showNotification({
            title: 'Error',
            message: 'Failed to send continue details.',
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

        const id = setInterval(() => {
          setCount((prevCount) => {
            if (prevCount === 0) {
              if (minCount === 0) {
                handleTimerEnd();
                clearInterval(id); // Stop the timer if it's no longer needed
                return 0;
              }
              setMinCount((prevMinCount) => prevMinCount - 1);
              return 59;
            }
            return prevCount - 1;
          });
        }, 1000); // 1-second intervals
        setTimerId(id);
      } else {
        const startTime = new Date();
        setStartTime(startTime); // Set start time

        const startDetails = {
          timer_id: 1,
          highlight_id: selectedTask !== null ? Number(selectedTask) : 1,
          user_id: userId, // Replace with the actual user ID
          start_time: startTime.toISOString(),
          status: "uncomplete"
        };
        try {
          await sendStartTimeData(startDetails);
          const response = await getActiveTimerHighlightDetails(startDetails.user_id); // Replace with the actual user ID
          const { pomo_id, highlight_id } = response[0];
          setPomoId(pomo_id);
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

        const id = setInterval(() => {
          setCount((prevCount) => {
            if (prevCount === 0) {
              if (minCount === 0) {
                handleTimerEnd();
                clearInterval(id); // Stop the timer if it's no longer needed
                return 0;
              }
              setMinCount((prevMinCount) => prevMinCount - 1);
              return 59;
            }
            return prevCount - 1;
          });
        }, 1000); // 1-second intervals
        setTimerId(id);
      }

    } else if (active === 'break') {
      if (paused) {
        setPaused(false);

        const continueTime = new Date();
        setStartTime(continueTime);

        showNotification({
          title: 'Break Timer Continued',
          message: 'The break timer has been continued.',
          icon: <IconInfoCircle />,
          color: 'green',
          autoClose: 3000,
          radius: 'md',
          styles: (theme) => ({
            root: {
              backgroundColor: theme.colors.green[6],
              borderColor: theme.colors.green[6],
              '&::before': { backgroundColor: theme.white },
            },
            title: { color: theme.white },
            description: { color: theme.white },
            closeButton: {
              color: theme.white,
              '&:hover': { backgroundColor: theme.colors.green[7] },
            },
          }),
        });

        const id = setInterval(() => {
          setCount((prevCount) => {
            if (prevCount === 0) {
              if (minCount === 0) {
                handleTimerEnd();
                clearInterval(id); // Stop the timer if it's no longer needed
                return 0;
              }
              setMinCount((prevMinCount) => prevMinCount - 1);
              return 59;
            }
            return prevCount - 1;
          });
        }, 1000); // 1-second intervals
        setTimerId(id);
      } else {

        const pauseTime = new Date();
        const pauseDetails = {
          pomo_id: pomoId ?? 0,
          highlight_id: highlightId ?? 1,
          pause_time: pauseTime.toISOString(),
        };

        try {

          await sendPauseData(pauseDetails);

          showNotification({
            title: 'Break Timer Paused',
            message: 'The break timer has been paused.',
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
            message: 'Failed to send break pause details.',
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

        const id = setInterval(() => {
          setCount((prevCount) => {
            if (prevCount === 0) {
              if (minCount === 0) {
                handleTimerEnd();
                clearInterval(id); // Stop the timer if it's no longer needed
                return 0;
              }
              setMinCount((prevMinCount) => prevMinCount - 1);
              return 59;
            }
            return prevCount - 1;
          });
        }, 1000); // 1-second intervals
        setTimerId(id);
      }
    }
  };




  const handleTimerEnd = useCallback(() => {
    if (timerId) clearInterval(timerId);

    if (active === 'focus') {
      setCycles(prevCycles => prevCycles + 1);
      setActive('break');
      setPaused(false);
      setMinCount((cycles + 1) % CYCLES_BEFORE_LONG_BREAK === 0 ? LONG_BREAK : SHORT_BREAK);
    } else {
      setActive('focus');
      setMinCount(WORK_TIME);
      setPaused(true);
    }

    setCount(0);
    setStarted(false);

    showNotification({
      title: 'Timer Ended',
      message: 'Time to switch!',
      icon: <IconInfoCircle />,
      color: 'teal',
    });
    window.location.reload();
  }, [timerId, active, cycles, setCycles, setActive, setPaused, setMinCount, setCount, setStarted]);


  const endTimer = () => {
    if (timerId) clearInterval(timerId);

    Swal.fire({
      title: 'Highlight Completion',
      text: 'Is the highlight complete?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
      background: '#f0f8ff',
      color: '#007bff',
    }).then((result) => {
      if (result.isConfirmed) {
        handleEndTimerConfirm(true);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        handleEndTimerConfirm(false);
      }
    });
  };


  const handleEndTimerConfirm = async (isTaskComplete: boolean) => {
    setModalOpened(false);


    const currentTimerId = selectedTask !== null && timer_details
      ? Number(timer_details[selectedTask]?.timer_id) // Convert to number
      : -1; // Default value or handle as needed

    const end_time = new Date();

    // const userId = user?.id;
    let task_status: string;

    if (isTaskComplete) {
      task_status = "complete";
    } else {
      task_status = "uncomplete";
    }

    const endPomoDetails = {
      pomo_id: pomoId ?? 1,
      timer_id: 1,
      highlight_id: highlightId ?? 1,
      user_id: userId,
      end_time: end_time.toISOString(),
      status: task_status
    };

    try {
      await sendTimerEndData(endPomoDetails);
      onEndButtonClick();
      showNotification({
        title: 'Timer Ended',
        message: 'The timer has been reset to the beginning and details have been sent.',
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
        message: 'Failed to send timer details.',
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

    // Reset the timer state
    setActive('focus');
    setMinCount(WORK_TIME);
    setCount(0);
    setPaused(false);
    setStarted(false);
  };

  const totalSeconds = minCount * 60 + count;
  const initialTotalSeconds = active === 'focus'
    ? WORK_TIME * 60
    : cycles % CYCLES_BEFORE_LONG_BREAK === 0
      ? LONG_BREAK * 60
      : SHORT_BREAK * 60;
  const percentage = totalSeconds > 0
    ? 100 - (totalSeconds / initialTotalSeconds) * 100
    : 0;

  useEffect(() => {
    if (totalSeconds === 0 && started) {
      handleTimerEnd();
    }
  }, [totalSeconds, started, handleTimerEnd]);


  const handleHighlightSelect = (index: number) => {
    setSelectedTask(index + 1);
    setMenuOpened(false);
  };


  return (
    <div className={styles.container}>
      <div className={styles.pomodoro}>
        <div className={styles.focusLink}>
          <Menu withArrow opened={menuOpened} onChange={setMenuOpened}>
            <Menu.Target>
              <UserButton
                label={selectedTask !== null && highlights ? highlights[selectedTask - 1]?.highlight_name : "Focus"}
                styles={{
                  label: {
                    fontSize: '14px',
                  },
                }}
                onClick={() => setMenuOpened((prev) => !prev)}
              />
            </Menu.Target>
            <Menu.Dropdown>
              <Tabs variant="outline" defaultValue="Task">
                <Tabs.List>
                  <Tabs.Tab value="Task">Task</Tabs.Tab>
                  <Tabs.Tab value="Timer">Timer</Tabs.Tab>
                </Tabs.List>
                {highlights ? <HighlightMenu highlights={highlights} onHighlightSelect={handleHighlightSelect} closeMenu={() => setMenuOpened(false)} /> : null}
                {timer_details ? <TimerMenu timer_details={timer_details} /> : null}
              </Tabs>
            </Menu.Dropdown>
          </Menu>
        </div>
        <div className={styles.progressBarContainer}>
          <CircularProgressbar
            value={percentage}
            text={formatTime(minCount, count)}
            styles={buildStyles({
              pathColor: active === 'focus' ? `#007bff` : `#ff6347`,
              textColor: '#000',
              trailColor: '#d6d6d6',
              textSize: '16px',
            })}
            className={styles.customTimeFont}
          />
        </div>
        <div className={styles.buttons}>
          {!started ? (
            <button className={`${styles.controlButton} ${styles.startButton}`} onClick={startTimer}>
              Start
            </button>
          ) : (
            <>
              {paused ? (
                <button className={`${styles.controlButton} ${styles.startButton}`} onClick={startTimer}>
                  Continue
                </button>
              ) : (
                <button className={`${styles.controlButton} ${styles.pauseButton}`} onClick={pauseTimer}>
                  Pause
                </button>
              )}
              <button className={`${styles.controlButton} ${styles.endButton}`} onClick={endTimer}>
                End
              </button>
            </>
          )}
        </div>
      </div>


    </div>
  );
};

export default Timer;
