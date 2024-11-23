import { useState, ReactNode } from 'react';
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
  Stack
} from '@mantine/core';
import PageLayout from '@/components/PageLayout/PageLayout';
import { useMediaQuery } from '@mantine/hooks';
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
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleSaveSettings = () => {
    setSettingsOpened(false);
  };

  const handleCancelSettings = () => {
    setSettingsOpened(false);
  };

  const handleEndButtonClick = () => {
    setRefreshTrigger(prev => !prev);
  };

  return (
    <Container size="xl" className={styles.app}>
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
                <Menu>
                  <Menu.Target>
                    <Button variant="subtle" size="xs">+</Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item>New Item 1</Menu.Item>
                    <Menu.Item>New Item 2</Menu.Item>
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
                ? <Timer onEndButtonClick={handleEndButtonClick} /> 
                : <Stop_watch onEndButtonClick={handleEndButtonClick} />
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