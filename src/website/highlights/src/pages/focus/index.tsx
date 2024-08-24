import { useState } from 'react';
import { ReactNode } from 'react';
import { Title, Container, Box, Menu, Button, Modal, NumberInput } from '@mantine/core';
import PageLayout from '@/components/PageLayout/PageLayout';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css'; // Import styles for the resizable component
import styles from './index.module.css';
import Timer from '../../components/Timer/Timer';
import Stop_watch from '../../components/Stopwatch/Stopwatch';
import FocusSummary from '../../components/FocusSummary/FocusSummary';

export default function Focus() {
  const [activeTab, setActiveTab] = useState<'Pomo' | 'Stopwatch'>('Pomo');
  const [settingsOpened, setSettingsOpened] = useState(false);
  const [pomoDuration, setPomoDuration] = useState<number>(25);
  const [shortBreakDuration, setShortBreakDuration] = useState<number>(5);
  const [longBreakDuration, setLongBreakDuration] = useState<number>(15);
  const [pomosPerLongBreak, setPomosPerLongBreak] = useState<number>(4);

  const handleSaveSettings = () => {
    setSettingsOpened(false);
  };

  const handleCancelSettings = () => {
    setSettingsOpened(false);
  };

  return (
    <Container className={styles.app}>
      <ResizableBox
        className={styles.resizableBox}
        width={800}
        height={Infinity}
        minConstraints={[600, Infinity]}
        maxConstraints={[800, Infinity]}
        axis="x"
      >
        <div className={styles.leftPane}>
          <div className={styles.header}>
            <Title order={3} className={styles.title}>Pomodoro</Title>
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${activeTab === 'Pomo' ? styles.active : ''}`}
                onClick={() => setActiveTab('Pomo')}
              >
                Pomo
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'Stopwatch' ? styles.active : ''}`}
                onClick={() => setActiveTab('Stopwatch')}
              >
                Stopwatch
              </button>
            </div>
            <div className={styles.icons}>
              <Menu trigger="click-hover" openDelay={100} closeDelay={50}>
                <Menu.Target>
                  <button className={styles.iconButton}>+</button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item>New Item 1</Menu.Item>
                  <Menu.Item>New Item 2</Menu.Item>
                </Menu.Dropdown>
              </Menu>
              <Menu trigger="click-hover" openDelay={100} closeDelay={50}>
                <Menu.Target>
                  <button className={styles.iconButton}>...</button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item>Statistics</Menu.Item>
                  <Menu.Item onClick={() => setSettingsOpened(true)}>Focus Settings</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>
          </div>
          <Box className={styles.content}>
            {activeTab === 'Pomo' ? <Pomo /> : <Stopwatch />}
          </Box>
        </div>
      </ResizableBox>
      <div className={styles.rightPane}>
        <FocusSummary activeTab={activeTab} />
      </div>
      <Modal
        opened={settingsOpened}
        onClose={() => setSettingsOpened(false)}
        title="Focus Settings"
        centered
        size="md"
        radius="md"
        classNames={{
          header: styles.modalHeader,
          body: styles.modalBody,
        }}
      >
        <div className={styles.focusSettings}>
          <div className={styles.timerOptions}>
            <div className={styles.timerOption}>
              <span>Pomo duration</span>
              <div className={styles.inputTimerOption}>
                <NumberInput
                  value={pomoDuration}
                  onChange={(val) => setPomoDuration(Number(val))}
                  min={1}
                  max={60}
                  step={1}
                  placeholder="Minutes"
                />
              </div>
            </div>
            <div className={styles.timerOption}>
              <span>Short break duration</span>
              <NumberInput
                value={shortBreakDuration}
                onChange={(val) => setShortBreakDuration(Number(val))}
                min={1}
                max={30}
                step={1}
                placeholder="Minutes"
              />
            </div>
            <div className={styles.timerOption}>
              <span>Long break duration</span>
              <NumberInput
                value={longBreakDuration}
                onChange={(val) => setLongBreakDuration(Number(val))}
                min={5}
                max={60}
                step={1}
                placeholder="Minutes"
              />
            </div>
            <div className={styles.timerOption}>
              <span>Pomodoros per long break</span>
              <NumberInput
                value={pomosPerLongBreak}
                onChange={(val) => setPomosPerLongBreak(Number(val))}
                min={1}
                max={10}
                step={1}
                placeholder="Pomos"
              />
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <Button onClick={handleSaveSettings} className={styles.saveButton}>OK</Button>
            <Button onClick={handleCancelSettings} className={styles.cancelButton}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </Container>
  );
}

const Pomo: React.FC = () => {
  return <div><Timer /></div>;
};

const Stopwatch: React.FC = () => {
  return (
    <div>
      <Stop_watch />
    </div>
  );
};

Focus.getLayout = function getLayout(page: ReactNode) {
  return <PageLayout>{page}</PageLayout>;
};
