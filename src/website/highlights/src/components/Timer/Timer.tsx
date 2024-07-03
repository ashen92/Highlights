import { useState, useEffect, forwardRef } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { showNotification } from '@mantine/notifications';
import { IconInfoCircle, IconChevronRight, IconCalendarDue } from '@tabler/icons-react';
import { Group, Avatar, Text, Menu, UnstyledButton, ScrollArea, TextInput, Tabs } from '@mantine/core';
import styles from './Timer.module.css';

const tasks = [
  { title: 'Learning Ballerina', time: '9:00am-1:00pm' },
  { title: 'React Project', time: '2:00pm-5:00pm' },
  { title: 'Exercise', time: '6:00pm-7:00pm' },
  // Add more tasks as needed
];

interface UserButtonProps {
  image?: string;
  label: string;
  icon?: React.ReactNode;
  styles?: {
    label?: {
      fontSize?: string;
    };
  };
}

const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
  ({ image, label, icon, styles: userStyles, ...others }: UserButtonProps, ref) => {
    return (
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

const Timer = () => {
  const WORK_TIME = 25; // in minutes for work session
  const SHORT_BREAK = 5; // in minutes for short break
  const LONG_BREAK = 15; // in minutes for long break
  const CYCLES_BEFORE_LONG_BREAK = 4; // number of work sessions before a long break

  const [active, setActive] = useState('focus'); // 'focus' for work session, 'break' for break session
  const [minCount, setMinCount] = useState(WORK_TIME); // Initial time is set to WORK_TIME
  const [count, setCount] = useState(0); // Seconds count within the current minute
  const [paused, setPaused] = useState(true); // Timer paused state
  const [started, setStarted] = useState(false); // Timer started state
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null); // Timer ID for setInterval
  const [cycles, setCycles] = useState(0); // Number of completed work cycles
  const [selectedTask, setSelectedTask] = useState<number | null>(null); // State to track selected task

  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const resetTime = () => {
    if (timerId) clearInterval(timerId);
    setMinCount(active === 'focus' ? WORK_TIME : (cycles % CYCLES_BEFORE_LONG_BREAK === 0 ? LONG_BREAK : SHORT_BREAK));
    setCount(0);
    setPaused(true);
    setStarted(false);
  };

  const pauseTimer = () => {
    setPaused(true);
    if (timerId) clearInterval(timerId);
  };

  const startTimer = () => {
    setStarted(true);
    if (paused) {
      setPaused(false);
      setTimerId(
        setInterval(() => {
          setCount(prevCount => {
            if (prevCount === 0) {
              if (minCount === 0) {
                handleTimerEnd();
                return 0;
              }
              setMinCount(prevMinCount => prevMinCount - 1);
              return 59;
            }
            return prevCount - 1;
          });
        }, 1000)
      );
    }
  };

  const handleTimerEnd = () => {
    if (timerId) clearInterval(timerId);
    if (active === 'focus') {
      setCycles(prevCycles => prevCycles + 1);
      setActive('break');
      setMinCount((cycles + 1) % CYCLES_BEFORE_LONG_BREAK === 0 ? LONG_BREAK : SHORT_BREAK);
    } else {
      setActive('focus');
      setMinCount(WORK_TIME);
    }
    setCount(0);
    setPaused(true);
    setStarted(false);
  };

  const endTimer = () => {
    if (timerId) clearInterval(timerId);
    setActive('focus');
    setMinCount(WORK_TIME);
    setCount(0);
    setPaused(true);
    setStarted(false);
    showNotification({
      title: 'Timer Ended',
      message: 'The timer has been reset to the beginning.',
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
  }, [totalSeconds, started]);

  const handleTaskClick = (index: number) => {
    setSelectedTask(selectedTask === index ? null : index);
  };

  return (
    <div className={styles.container}>
      <div className={styles.pomodoro}>
        <div className={styles.focusLink}>
          <Menu withArrow>
            <Menu.Target>
              <UserButton
                label="Focus"
                styles={{
                  label: {
                    fontSize: '14px', // Adjust font size
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

                <Tabs.Panel value="Task">
                  <div className={styles.taskContainer}>
                    <TextInput
                      placeholder="search"
                      className={styles.searchInput}
                    />
                    <div className={styles.taskHeader}>
                      <IconCalendarDue />
                      <Text>Today &gt;</Text>
                    </div>
                    <Menu.Label>Select doing Task</Menu.Label>
                    {tasks.map((task, index) => (
                      <Menu.Item
                        key={index}
                        onClick={() => handleTaskClick(index)}
                        
                      >
                        {task.title}
                      </Menu.Item>
                    ))}
                  </div>
                </Tabs.Panel>

                <Tabs.Panel value="Timer">
                  <div className={styles.taskContainer}>
                    <TextInput
                      placeholder="search"
                      className={styles.searchInput}
                    />
                    <Menu.Label>Select a Timer</Menu.Label>
                    {tasks.map((task, index) => (
                      <Menu.Item key={index}>
                        {task.title}
                      </Menu.Item>
                    ))}
                  </div>
                </Tabs.Panel>
              </Tabs>
            </Menu.Dropdown>
          </Menu>
        </div>
        <div className={styles.progressBarContainer}>
          <CircularProgressbar
            value={percentage}
            text={formatTime(minCount, count)}
            styles={buildStyles({
              pathColor: active === 'focus' ? `#007bff` : `#ff6347`, // Blue for focus, Red for break
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
