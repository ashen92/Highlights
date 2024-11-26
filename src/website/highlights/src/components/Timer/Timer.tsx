import React, { useState, useEffect, forwardRef, useCallback } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { showNotification } from '@mantine/notifications';
import { IconInfoCircle, IconChevronRight, IconCalendarDue, IconHourglassHigh } from '@tabler/icons-react';
import { Group, Avatar, Text, Menu, UnstyledButton, TextInput, Tabs, Modal, Button } from '@mantine/core';
import styles from './Timer.module.css';
import { useHighlights } from "@/hooks/useHighlights";
import { useTimers } from '@/hooks/useTimer';

import { useAppContext } from '@/features/account/AppContext';
import { HighlightTask } from "@/models/HighlightTask";
import { mTimer, ActiveHighlightDetails } from '@/models/Timer';
import { sendTimerEndData, sendPauseData, sendContinueData, sendStartTimeData, getActiveTimerHighlightDetails } from "@/services/api";
import Swal from 'sweetalert2';
import { h_GetHighlights } from "@/models/HighlightTask";

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
  onEndButtonClick: () => void;
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

const HighlightMenu = ({ highlights, onHighlightSelect, closeMenu }: {
  highlights: h_GetHighlights[],
  onHighlightSelect: (highlight: h_GetHighlights) => void,
  closeMenu: () => void
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHighlights = highlights.filter((highlight) =>
    highlight.highlight_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (highlight: h_GetHighlights) => {
    onHighlightSelect(highlight);
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
          {filteredHighlights.map((highlight) => (
            <Menu.Item key={highlight.highlight_id} onClick={() => handleSelect(highlight)}>
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

  const [active, setActive] = useState('focus');
  const [minCount, setMinCount] = useState(WORK_TIME);
  const [count, setCount] = useState(0);
  const [paused, setPaused] = useState(false);
  const [started, setStarted] = useState(false);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [cycles, setCycles] = useState(0);
  const [selectedHighlight, setSelectedHighlight] = useState<h_GetHighlights | null>(null);

  const { timer_details, istimer_detailsLoading, istimer_detailsError } = useTimers();
  const { user } = useAppContext();


  const userId = Number(user.id);
  const [menuOpened, setMenuOpened] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [pomoId, setPomoId] = useState<number | null>(null);
  const [highlightId, setHighlightId] = useState<number | null>(null);
  const [activeHighlights, setActiveHighlights] = useState<ActiveHighlightDetails[]>([]);



  const { highlights, isHighlightsLoading, isHighlightsError } = useHighlights(user);


  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  useEffect(() => {
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

  const handleHighlightSelect = (highlight: h_GetHighlights) => {
    setSelectedHighlight(highlight);
    console.log("Highlight selected",highlight);
    setHighlightId(highlight.highlight_id);
    setMenuOpened(false);
  };



  const pauseTimer = async () => {
  };



  const startTimer = async () => {
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
  };


  const handleEndTimerConfirm = async (isTaskComplete: boolean) => {
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

  return (
    <div className={styles.container}>
      <div className={styles.pomodoro}>
        <div className={styles.focusLink}>
          <Menu withArrow opened={menuOpened} onChange={setMenuOpened}>
            <Menu.Target>
              <UserButton
                label={selectedHighlight ? selectedHighlight.highlight_name : "Focus"}
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
                {highlights ? (
                  <HighlightMenu
                    highlights={highlights}
                    onHighlightSelect={handleHighlightSelect}
                    closeMenu={() => setMenuOpened(false)}
                  />
                ) : null}
                {timer_details ? <TimerMenu timer_details={timer_details} /> : null}
              </Tabs>
            </Menu.Dropdown>
          </Menu>
        </div>

        {/* Rest of the component remains the same */}
        <div className={styles.progressBarContainer}>
          <CircularProgressbar
            value={percentage}  // Add the value prop using the existing percentage calculation
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