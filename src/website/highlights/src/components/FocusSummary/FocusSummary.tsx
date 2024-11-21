import React, { useEffect, useState } from "react";
import styles from "./FocusSummary.module.css";
import Image from 'next/image';
import empty from "./empty.jpg"
import { getFocusRecord, getPauseDetails, getStopwatchFocusRecord, getStopwatchPauseDetails } from "@/services/api";
import { mTimeRecord, mPauseContinueDetails, mStopwatchTimeRecord, mStopwatchPauseContinueDetails } from "@/models/Timer";
import { Title, Timeline, Text, Badge, Group, Tooltip } from '@mantine/core';
import { Coffee, Clock, PlayCircle, StopCircle, CheckCircle2 } from 'lucide-react';
import { useAppContext } from "@/features/account/AppContext";

interface FocusSummaryProps {
  activeTab: 'Pomo' | 'Stopwatch';
  refreshTrigger: boolean;
}

const calculateDuration = (start: string, end: string): string => {
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  const diffMinutes = Math.round((endTime - startTime) / (1000 * 60));

  if (diffMinutes < 1) return "Less than a minute";
  return `${diffMinutes} min${diffMinutes !== 1 ? 's' : ''}`;
};

const TaskTimeline = ({
  record,
  pauseTimes,
  formatTime
}: {
  record: mTimeRecord | mStopwatchTimeRecord,
  pauseTimes: string[][],
  formatTime: (datetime: string) => string
}) => {
  const totalDuration = calculateDuration(record.start_time, record.end_time);

  const getBreakDuration = (pauseTime: string, continueTime: string) => {
    if (continueTime === "Invalid Date" || !continueTime) {
      return calculateDuration(pauseTime, record.end_time);
    }
    return calculateDuration(pauseTime, continueTime);
  };

  return (
    <div className={styles.timelineContainer}>
      <Group  mb="md">
        <div>
          <Text size="lg" className={styles.taskTitle}>
            {record.highlight_name}
          </Text>
          <Group >
            <Clock size={14} />
            <Text size="sm" color="dimmed">
              Total Duration: {totalDuration}
            </Text>
          </Group>
        </div>
        <Badge
          variant="dot"
          color="green"
          size="lg"
        >
          Completed
        </Badge>
      </Group>

      <Timeline active={pauseTimes.length * 2 + 2} bulletSize={28} lineWidth={2}>
        <Timeline.Item
          bullet={<PlayCircle size={20} />}
          title={
            <Text size="sm">Started Focus Session</Text>
          }
        >
          <Text color="dimmed" size="sm">
            {formatTime(record.start_time)}
          </Text>
        </Timeline.Item>

        {pauseTimes.map((time, index) => {
          const breakDuration = getBreakDuration(time[0], time[1]);
          return (
            <Timeline.Item
              key={index}
              bullet={<Coffee size={20} />}
              title={
                <Text  size="sm">
                  Break {index + 1}
                </Text>
              }
            >
              <Group  mb={4}>
                <Text color="dimmed" size="sm">
                  {time[0]}
                </Text>
                <Text color="dimmed" size="sm">→</Text>
                <Text color="dimmed" size="sm">
                  {time[1] === "Invalid Date" || !time[1] ? formatTime(record.end_time) : time[1]}
                </Text>
              </Group>
              <Badge
                variant="light"
                color="blue"
                size="sm"
              >
                {breakDuration}
              </Badge>
            </Timeline.Item>
          );
        })}

        <Timeline.Item
          bullet={<CheckCircle2 size={20} />}
          title={
            <Text  size="sm">Completed Session</Text>
          }
        >
          <Text color="dimmed" size="sm">
            {formatTime(record.end_time)}
          </Text>
        </Timeline.Item>
      </Timeline>
    </div>
  );
};

const FocusSummary: React.FC<FocusSummaryProps> = ({ activeTab, refreshTrigger }) => {
  const [focusRecords, setFocusRecords] = useState<mTimeRecord[]>([]);
  const [pauseDetails, setPauseDetails] = useState<mPauseContinueDetails[]>([]);
  const [stopwatchfocusRecords, setstopwatchFocusRecords] = useState<mStopwatchTimeRecord[]>([]);
  const [stopwatchpauseDetails, setstopwatchPauseDetails] = useState<mStopwatchPauseContinueDetails[]>([]);
  const { user } = useAppContext();

  const userId = Number(user.id);

  useEffect(() => {
    const fetchFocusData = async () => {
      try {
        if (activeTab === 'Pomo') {
          const [records, pauses] = await Promise.all([
            getFocusRecord(userId, activeTab),
            getPauseDetails(userId, activeTab)
          ]);
          setFocusRecords(records);
          setPauseDetails(pauses);
        } else if (activeTab === 'Stopwatch') {
          const [records, pauses] = await Promise.all([
            getStopwatchFocusRecord(userId, activeTab),
            getStopwatchPauseDetails(userId, activeTab)
          ]);

          setstopwatchFocusRecords(records);
          setstopwatchPauseDetails(pauses);
        }
      } catch (error) {
        console.error("Error fetching focus records or pause details:", error);
      }
    };

    fetchFocusData();
  }, [userId, activeTab, refreshTrigger]); // Added refreshTrigger to dependency array


  const groupByDate = (records: mTimeRecord[]) => {
    return records.reduce((acc, record) => {
      const date = new Date(record.start_time).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(record);
      return acc;
    }, {} as Record<string, mTimeRecord[]>);
  };

  const groupByDateStopwatch = (records: mStopwatchTimeRecord[]) => {
    return records.reduce((acc, record) => {
      const date = new Date(record.start_time).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(record);
      return acc;
    }, {} as Record<string, mStopwatchTimeRecord[]>);
  };

  const formatTime = (datetime: string) => {
    return new Date(datetime).toLocaleTimeString();
  };

  const getPauseAndContinueTimes = (pomoId: number) => {
    return pauseDetails
      .filter((detail) => detail.pomo_id === pomoId)
      .map((detail) => [
        formatTime(detail.pause_time ?? ''),
        formatTime(detail.continue_time ?? '')
      ]);
  };

  const getStopwatchPauseAndContinueTimes = (stopwatchId: number) => {
    return stopwatchpauseDetails
      .filter((detail) => detail.stopwatch_id === stopwatchId)
      .map((detail) => [
        formatTime(detail.pause_time ?? ''),
        formatTime(detail.continue_time ?? '')
      ]);
  };

  const groupedRecords = groupByDate(focusRecords);
  const groupedRecordsStopwatch = groupByDateStopwatch(stopwatchfocusRecords);

  return (
    <div className={styles.container}>
      {activeTab === 'Pomo' && (
        <div className={styles.focusRecord}>
          <Title order={3} className={styles.title}>Pomodoro Focus Records</Title>
          {Object.keys(groupedRecords).length === 0 ? (
            <div className={styles.noRecords}>
              <Image src={empty} alt="" style={{ width: '50%', height: '50%' }} />
              <p className={styles.grayText}>
                Your focus history is waiting. <br />
                Get started with a timer and see your progress!
              </p>
            </div>
          ) : (
            Object.keys(groupedRecords)
              .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
              .map((date) => (
                <div key={date} className={styles.dateGroup}>
                  <div className={styles.date}>{date}</div>
                  <div className={styles.timeline}>
                    {groupedRecords[date]
                      .sort((a, b) => new Date(b.end_time).getTime() - new Date(a.end_time).getTime())
                      .map((record) => (
                        <TaskTimeline
                          key={record.pomo_id}
                          record={record}
                          pauseTimes={getPauseAndContinueTimes(record.pomo_id)}
                          formatTime={formatTime}
                        />
                      ))}
                  </div>
                </div>
              ))
          )}
        </div>
      )}

      {activeTab === 'Stopwatch' && (
        // ... (similar structure for Stopwatch, just replace the relevant functions and types)
        <div className={styles.focusRecord}>
          <Title order={3} className={styles.title}>Stopwatch Focus Records</Title>
          {Object.keys(groupedRecordsStopwatch).length === 0 ? (
            <div className={styles.noRecords}>
              <Image src={empty} alt="" style={{ width: '50%', height: '50%' }} />
              <p className={styles.grayText}>
                Your focus history is waiting. <br />
                Get started with a timer and see your progress!
              </p>
            </div>
          ) : (
            Object.keys(groupedRecordsStopwatch)
              .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
              .map((date) => (
                <div key={date} className={styles.dateGroup}>
                  <div className={styles.date}>{date}</div>
                  <div className={styles.timeline}>
                    {groupedRecordsStopwatch[date]
                      .sort((a, b) => new Date(b.end_time).getTime() - new Date(a.end_time).getTime())
                      .map((record) => (
                        <TaskTimeline
                          key={record.stopwatch_id}
                          record={record}
                          pauseTimes={getStopwatchPauseAndContinueTimes(record.stopwatch_id)}
                          formatTime={formatTime}
                        />
                      ))}
                  </div>
                </div>
              ))
          )}
        </div>
      )}
    </div>
  );
};

export default FocusSummary;