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
  Text,
  Switch,
  Divider,
  ColorSwatch,
  ActionIcon,
  Tooltip,
  SegmentedControl,
  Select,
} from '@mantine/core';
import { IconBrain, IconCoffee, IconMoon, IconRepeat, IconInfoCircle, IconVolume, IconBell, IconCheck, IconX } from '@tabler/icons-react';
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

interface FocusSettings {
  pomoDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  pomosPerLongBreak: number;
  autoStartBreaks: boolean;
  autoStartPomos: boolean;
  notifications: boolean;
  soundEnabled: boolean;
  soundVolume: number;
  alarmSound: string;
  theme: string;
}

export default function Focus() {
  const [activeTab, setActiveTab] = useState<'Pomo' | 'Stopwatch'>('Pomo');
  const [settingsOpened, setSettingsOpened] = useState<boolean>(false);
  const [pomoDuration, setPomoDuration] = useState<number>(25);
  const [shortBreakDuration, setShortBreakDuration] = useState<number>(5);
  const [longBreakDuration, setLongBreakDuration] = useState<number>(15);
  const [pomosPerLongBreak, setPomosPerLongBreak] = useState<number>(4);
  const [autoStartBreaks, setAutoStartBreaks] = useState<boolean>(false);
  const [autoStartPomos, setAutoStartPomos] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [soundVolume, setSoundVolume] = useState<number>(80);
  const [alarmSound, setAlarmSound] = useState<string>("bell");
  const [theme, setTheme] = useState<string>("light");
  const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false);
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useAppContext();

  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleSaveSettings = () => {
    // Here you would typically save all settings to your backend/localStorage
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
    fetchTasks();
    setRefreshTrigger((prev) => !prev);
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
        {/* Existing SimpleGrid content */}
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

      {/* Enhanced Settings Modal */}
      <Modal
        opened={settingsOpened}
        onClose={() => setSettingsOpened(false)}
        title={
          <Group gap="xs">
            <IconBrain size={24} />
            <Text size="xl" fw={600}>Focus Settings</Text>
          </Group>
        }
        centered
        size="lg"
      >
        <Stack gap="lg">
          {/* Timer Settings Section */}
          <Paper withBorder p="md" radius="md">
            <Stack gap="md">
              <Text fw={500} size="sm" c="dimmed">TIMER DURATIONS</Text>
              
              <Group gap="md" grow>
                <NumberInput
                  label={
                    <Group gap="xs">
                      <IconBrain size={16} />
                      <Text>Focus Length</Text>
                    </Group>
                  }
                  value={pomoDuration}
                  onChange={(val) => setPomoDuration(Number(val))}
                  min={1}
                  max={60}
                  stepHoldDelay={500}
                  stepHoldInterval={100}
                  suffix=" min"
                />
                
                <NumberInput
                  label={
                    <Group gap="xs">
                      <IconCoffee size={16} />
                      <Text>Short Break</Text>
                    </Group>
                  }
                  value={shortBreakDuration}
                  onChange={(val) => setShortBreakDuration(Number(val))}
                  min={1}
                  max={30}
                  stepHoldDelay={500}
                  stepHoldInterval={100}
                  suffix=" min"
                />
              </Group>

              <Group gap="md" grow>
                <NumberInput
                  label={
                    <Group gap="xs">
                      <IconMoon size={16} />
                      <Text>Long Break</Text>
                    </Group>
                  }
                  value={longBreakDuration}
                  onChange={(val) => setLongBreakDuration(Number(val))}
                  min={5}
                  max={60}
                  stepHoldDelay={500}
                  stepHoldInterval={100}
                  suffix=" min"
                />
                
                <NumberInput
                  label={
                    <Group gap="xs">
                      <IconRepeat size={16} />
                      <Text>Sessions until Long Break</Text>
                    </Group>
                  }
                  value={pomosPerLongBreak}
                  onChange={(val) => setPomosPerLongBreak(Number(val))}
                  min={1}
                  max={10}
                />
              </Group>
            </Stack>
          </Paper>

          {/* Automation Settings */}
          <Paper withBorder p="md" radius="md">
            <Stack gap="md">
              <Text fw={500} size="sm" c="dimmed">AUTOMATION</Text>
              
              <Group justify="space-between">
                <Group gap="xs">
                  <Text size="sm">Auto-start Breaks</Text>
                  <Tooltip label="Automatically start break timer when a focus session ends">
                    <ActionIcon variant="subtle" size="sm">
                      <IconInfoCircle size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
                <Switch
                  checked={autoStartBreaks}
                  onChange={(event) => setAutoStartBreaks(event.currentTarget.checked)}
                />
              </Group>

              <Group justify="space-between">
                <Group gap="xs">
                  <Text size="sm">Auto-start Focus Sessions</Text>
                  <Tooltip label="Automatically start next focus session when a break ends">
                    <ActionIcon variant="subtle" size="sm">
                      <IconInfoCircle size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
                <Switch
                  checked={autoStartPomos}
                  onChange={(event) => setAutoStartPomos(event.currentTarget.checked)}
                />
              </Group>
            </Stack>
          </Paper>

          {/* Notification Settings */}
          <Paper withBorder p="md" radius="md">
            <Stack gap="md">
              <Text fw={500} size="sm" c="dimmed">NOTIFICATIONS & SOUND</Text>

              <Group justify="space-between">
                <Text size="sm">Desktop Notifications</Text>
                <Switch
                  checked={notifications}
                  onChange={(event) => setNotifications(event.currentTarget.checked)}
                />
              </Group>

              <Group justify="space-between">
                <Text size="sm">Sound Enabled</Text>
                <Switch
                  checked={soundEnabled}
                  onChange={(event) => setSoundEnabled(event.currentTarget.checked)}
                />
              </Group>

              {soundEnabled && (
                <>
                  <Group grow align="center">
                    <Text size="sm">Volume</Text>
                    <Group gap="xs">
                      <IconVolume size={16} />
                      <NumberInput
                        value={soundVolume}
                        onChange={(val) => setSoundVolume(Number(val))}
                        min={0}
                        max={100}
                        step={10}
                        w={90}
                        suffix="%"
                      />
                    </Group>
                  </Group>

                  <Select
                    label="Alarm Sound"
                    value={alarmSound}
                    onChange={(value) => setAlarmSound(value || 'bell')}
                    data={[
                      { value: 'bell', label: 'Bell' },
                      { value: 'digital', label: 'Digital' },
                      { value: 'zen', label: 'Zen' },
                      { value: 'bird', label: 'Bird Chirp' },
                    ]}
                  />
                </>
              )}
            </Stack>
          </Paper>

          {/* Theme Settings */}
          <Paper withBorder p="md" radius="md">
            <Stack gap="md">
              <Text fw={500} size="sm" c="dimmed">APPEARANCE</Text>
              
              <SegmentedControl
                value={theme}
                onChange={setTheme}
                data={[
                  { label: 'Light', value: 'light' },
                  { label: 'Dark', value: 'dark' },
                  { label: 'System', value: 'system' },
                ]}
              />
            </Stack>
          </Paper>

          <Divider />

          {/* Action Buttons */}
          <Group justify="flex-end" gap="sm">
            <Button
              variant="subtle"
              color="gray"
              leftSection={<IconX size={16} />}
              onClick={handleCancelSettings}
            >
              Cancel
            </Button>
            <Button
              color="blue"
              leftSection={<IconCheck size={16} />}
              onClick={handleSaveSettings}
            >
              Save Changes
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}

Focus.getLayout = function getLayout(page: ReactNode) {
  return <PageLayout>{page}</PageLayout>;
};