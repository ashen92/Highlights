import { useState, ReactNode, useEffect } from 'react';
import {
  Title,
  Container,
  Box,
  Menu,
  Button,
  Modal,
  NumberInput,
  Tabs,
  SimpleGrid,
  Paper,
  Group,
  Stack,
} from '@mantine/core';
import PageLayout from '@/components/PageLayout/PageLayout';
import { useMediaQuery } from '@mantine/hooks';
import styles from './index.module.css';
import Timer from '../../components/Timer/Timer';
import Stop_watch from '../../components/Stopwatch/Stopwatch';
import FocusSummary from '../../components/FocusSummary/FocusSummary';
import AddTaskPopup from "@/components/AddTaskPopup/AddTaskPopup";
import { getTasks } from '@/services/api';
import { Task } from '@/models/Task';
import { useAppContext } from '@/features/account/AppContext';

export default function Focus() {
  const [activeTab, setActiveTab] = useState<'Pomo' | 'Stopwatch'>('Pomo');
  const [settingsOpened, setSettingsOpened] = useState(false);
  const [pomoDuration, setPomoDuration] = useState<number>(25);
  const [shortBreakDuration, setShortBreakDuration] = useState<number>(5);
  const [longBreakDuration, setLongBreakDuration] = useState<number>(15);
  const [pomosPerLongBreak, setPomosPerLongBreak] = useState<number>(4);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useAppContext();

  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleSaveSettings = () => {
    setSettingsOpened(false);
  };

  const handleCancelSettings = () => {
    setSettingsOpened(false);
  };

  const handleEndButtonClick = () => {
    setRefreshTrigger((prev) => !prev);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    fetchTasks(); // Fetch tasks after closing the popup
    setRefreshTrigger((prev) => !prev); // Toggle the refreshTrigger to re-render Timer
  };
  

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const fetchedTasks = await getTasks(user as any);
      setTasks(fetchedTasks);
      setIsError(false);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setIsError(true);
    }
    setIsLoading(false);
  };

  return (
    <Container className={styles.app}>
      <SimpleGrid
        cols={{ base: 1, md: 2 }}
        spacing={{ base: 'sm', md: 'md' }}
        verticalSpacing={{ base: 'sm', md: 'md' }}
      >
        <Paper shadow="xs" p="md" withBorder>
          <Stack gap="md">
            <Group justify="space-between" align="center">
              <Title order={3}>Pomodoro</Title>
              <Group>
                <Menu trigger="hover" openDelay={100} closeDelay={200}>
                  <Menu.Target>
                    <Button variant="subtle" size="xs">+</Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item onClick={() => setPopupOpen(true)}>
                      Add new Highlight
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
                <Menu>
                  <Menu.Target>
                    <Button variant="subtle" size="xs">...</Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item onClick={() => setSettingsOpened(true)}>
                      Focus Settings
                    </Menu.Item>
                    <Menu.Item>Statistics</Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Group>

            <Tabs value={activeTab} onChange={(value) => setActiveTab(value as 'Pomo' | 'Stopwatch')}>
              <Tabs.List grow>
                <Tabs.Tab value="Pomo">Pomo</Tabs.Tab>
                <Tabs.Tab value="Stopwatch">Stopwatch</Tabs.Tab>
              </Tabs.List>
            </Tabs>

            <Box>
              {activeTab === 'Pomo'
                ? <Timer 
                    onEndButtonClick={handleEndButtonClick} 
                    refreshTrigger={refreshTrigger} 
                  />
                : <Stop_watch 
                    onEndButtonClick={handleEndButtonClick} 
                    refreshTrigger={refreshTrigger} 
                  />
              }
            </Box>
          </Stack>
        </Paper>

        <Paper shadow="xs" p="md" withBorder>
          <FocusSummary
            activeTab={activeTab}
            refreshTrigger={refreshTrigger}
          />
        </Paper>
      </SimpleGrid>

      <AddTaskPopup open={popupOpen} onClose={handleClosePopup} />

      <Modal
        opened={settingsOpened}
        onClose={() => setSettingsOpened(false)}
        title="Focus Settings"
        centered
        size="md"
      >
        <Stack gap="md">
          <NumberInput
            label="Pomo Duration (Minutes)"
            value={pomoDuration}
            onChange={(val) => setPomoDuration(Number(val))}
            min={1}
            max={60}
          />
          <NumberInput
            label="Short Break Duration (Minutes)"
            value={shortBreakDuration}
            onChange={(val) => setShortBreakDuration(Number(val))}
            min={1}
            max={30}
          />
          <NumberInput
            label="Long Break Duration (Minutes)"
            value={longBreakDuration}
            onChange={(val) => setLongBreakDuration(Number(val))}
            min={5}
            max={60}
          />
          <NumberInput
            label="Pomodoros per Long Break"
            value={pomosPerLongBreak}
            onChange={(val) => setPomosPerLongBreak(Number(val))}
            min={1}
            max={10}
          />
          <Group justify="center">
            <Button onClick={handleSaveSettings}>Save</Button>
            <Button color="red" onClick={handleCancelSettings}>Cancel</Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}

Focus.getLayout = function getLayout(page: ReactNode) {
  return <PageLayout>{page}</PageLayout>;
};
