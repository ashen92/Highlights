import React, { useState, useEffect, forwardRef, useCallback } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { showNotification } from '@mantine/notifications';
import { IconInfoCircle, IconChevronRight, IconCalendarDue, IconHourglassHigh } from '@tabler/icons-react';
import { Group, Avatar, Text, Menu, UnstyledButton, TextInput, Tabs, Modal, Button } from '@mantine/core';
import styles from './Timer.module.css';
import { useHighlights } from "@/hooks/useHighlights";
import { useTimers } from '@/hooks/useTimer';
import { HighlightTask } from "@/models/HighlightTask";
import { Task } from "@/models/Task";
import { mTimer, ActiveHighlightDetails } from '@/models/Timer';
import { sendTimerEndData, sendPauseData, sendContinueData, sendStartTimeData, getActiveTimerHighlightDetails } from "@/services/api";
import Swal from 'sweetalert2';
import { useAppContext } from '@/features/account/AppContext';
import { useTasks } from '@/hooks/useTasks';



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
  refreshTrigger: boolean;
}

const HighlightMenu = ({ 
  highlights, 
  onHighlightSelect, 
  closeMenu 
}: { 
  highlights: Task[], 
  onHighlightSelect: (task: Task) => Task[],
  closeMenu: () => void 
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHighlights = highlights.filter((highlight) =>
    highlight.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (task: Task) => {
    onHighlightSelect(task);
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
          <div className={styles.scrollContainer}>
            {filteredHighlights.map((task) => (
              <Menu.Item key={task.taskId} onClick={() => handleSelect(task)}>
                {task.title}
              </Menu.Item>
            ))}
          </div>
        </Menu>
      </div>
    </Tabs.Panel>
  );
};



const Timer: React.FC<TimerProps> = ({ onEndButtonClick, refreshTrigger }) => {
  const WORK_TIME = 25;
  const SHORT_BREAK = 5;
  const LONG_BREAK = 15;
  const CYCLES_BEFORE_LONG_BREAK = 4;

  const { user } = useAppContext();

  const userId = Number(user.id);

  const [active, setActive] = useState('focus');
  const [minCount, setMinCount] = useState(WORK_TIME);
  const [count, setCount] = useState(0);
  const [paused, setPaused] = useState(false);
  const [started, setStarted] = useState(false);
  const [cycles, setCycles] = useState(0);

  const [pomoId, setPomoId] = useState<number | null>(null);

  const [menuOpened, setMenuOpened] = useState(false);

  const { highlights, isHighlightsLoading, isHighlightsError } = useHighlights(user);
  

};