import React, { useState, useEffect, useRef, forwardRef } from 'react';
import {Group, TextInput, List, ThemeIcon, Text, Menu, UnstyledButton, Tabs, Avatar } from '@mantine/core';
import { IconInfoCircle, IconChevronRight, IconCalendarDue,IconHourglassHigh  } from '@tabler/icons-react';
import { showNotification } from '@mantine/notifications';
import styles from './Stopwatch.module.css';
import { useHighlights } from "@/hooks/useHighlights";
import { useTimers } from '@/hooks/useTimer';
import { HighlightTask } from "@/models/HighlightTask";
import { mTimer } from '@/models/Timer';



interface UserButtonProps {
  image?: string;
  label: string;
  icon?: React.ReactNode;
  [key: string]: any;
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
          placeholder="search"
          className={styles.searchInput}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.currentTarget.value)}
        />
        <div className={styles.taskHeader}>
          <Text className={styles.today}> <IconCalendarDue />Today &gt;</Text>
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
          placeholder="search"
          className={styles.searchInput}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.currentTarget.value)}
        />
        <div className={styles.taskHeader}>
          <Text className={styles.today}> <IconHourglassHigh /> </Text>
        </div>
        <Menu>
          {/* <Menu.Label>Select doing Task</Menu.Label> */}
          {filteredTimers.map((timer) => (
            <Menu.Item key={timer.timer_id}>{timer.timer_name}</Menu.Item>
          ))}
        </Menu>
      </div>
    </Tabs.Panel>
  );
};







const Stopwatch: React.FC = () => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [opened, setOpened] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const [selectedTask, setSelectedTask] = useState<number | null>(null); // State to track selected task
  const { highlights, isHighlightsLoading, isHighlightsError } = useHighlights();
  const { timer_details, istimer_detailsLoading, istimer_detailsError } = useTimers();
  const [menuOpened, setMenuOpened] = useState(false);



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

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleContinue = () => {
    setIsPaused(false);
  };

  const handleEnd = () => {
    setIsActive(false);
    setIsPaused(false);
    setTime(0);
    showNotification({
      title: 'Timer Ended',
      message: 'The stopwatch has been reset.',
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



  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progress = (time % 2100) / 2100; // 35 minutes * 60 seconds
  const offset = circumference - progress * circumference;

  // Formatting time to MM:SS
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
                {highlights ? <HighlightMenu highlights={highlights} onHighlightSelect={handleHighlightSelect} closeMenu={() => setMenuOpened(false)} /> : null}
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
          {!isActive && <button className={`${styles.startButton}`} onClick={handleStart}>Start</button>}
          {isActive && !isPaused && <button className={`${styles.pauseButton}`} onClick={handlePause}>Pause</button>}
          {isPaused && (
            <>
              <button className={`${styles.continueButton}`} onClick={handleContinue}>Continue</button>
              <button className={`${styles.endButton}`} onClick={handleEnd}>End</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stopwatch;