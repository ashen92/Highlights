import React, { useEffect, useState } from "react";
import styles from "./FocusSummary.module.css";
import { getFocusRecord, getPauseDetails, getStopwatchFocusRecord, getStopwatchPauseDetails } from "@/services/api";
import { mTimeRecord, mPauseContinueDetails, mStopwatchTimeRecord, mStopwatchPauseContinueDetails } from "@/models/Timer";
import { Title } from "@mantine/core";

interface FocusSummaryProps {
  activeTab: 'Pomo' | 'Stopwatch';
  refreshTrigger: boolean; // New prop to trigger refresh
}

const FocusSummary: React.FC<FocusSummaryProps> = ({ activeTab, refreshTrigger }) => {
  const [focusRecords, setFocusRecords] = useState<mTimeRecord[]>([]);
  const [pauseDetails, setPauseDetails] = useState<mPauseContinueDetails[]>([]);
  const [stopwatchfocusRecords, setstopwatchFocusRecords] = useState<mStopwatchTimeRecord[]>([]);
  const [stopwatchpauseDetails, setstopwatchPauseDetails] = useState<mStopwatchPauseContinueDetails[]>([]);
  const userId = 1; 

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
  },  [userId, activeTab, refreshTrigger]); // Added refreshTrigger to dependency array

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
      <Title order={3} className={styles.title}>Overview</Title>
      <div className={styles.overview}>
        <div className={styles.card}>
          <div className={styles.label}>Today&apos;s Pomo</div>
          <div className={styles.value}>0</div>
        </div>
        <div className={styles.card}>
          <div className={styles.label}>Today&apos;s Focus</div>
          <div className={styles.value}>0m</div>
        </div>
        <div className={styles.card}>
          <div className={styles.label}>Total Pomo</div>
          <div className={styles.value}>11</div>
        </div>
        <div className={styles.card}>
          <div className={styles.label}>Total Focus Duration</div>
          <div className={styles.value}>10h 13m</div>
        </div>
      </div>

      
       {activeTab === 'Pomo' && ( 
        
        <div className={styles.focusRecord}>
          <Title order={3} className={styles.title} >Pomodoro Focus Records</Title>
          {Object.keys(groupedRecords).map((date) => (
            <div key={date} className={styles.dateGroup}>
              <div className={styles.date}>{date}</div>
              <div className={styles.timeline}>
                {groupedRecords[date]
                  .sort((a, b) => new Date(b.end_time).getTime() - new Date(a.end_time).getTime())
                  .map((record) => (
                    <div key={record.pomo_id} className={styles.timeRecord}>
                      <span className={styles.mainRecord}>
                        {record.highlight_name} : {formatTime(record.start_time)} - {formatTime(record.end_time)}
                      </span>
                      {getPauseAndContinueTimes(record.pomo_id).map((time, index) => (
                        <div key={index} className={styles.pauseRecord}>
                          <span>{time[0]} - {time[1]}</span>
                        </div>
                      ))}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )} 

      {/* {activeTab === 'Stopwatch' && (
        <div className={styles.focusRecord}>
          {Object.keys(groupedRecordsStopwatch).map((date) => (
            <div key={date} className={styles.dateGroup}>
              <div className={styles.date}>{date}</div>
              <div className={styles.timeline}>
                {groupedRecordsStopwatch[date]
                 .sort((a, b) => new Date(b.end_time).getTime() - new Date(a.end_time).getTime())
                 .map((record) => (
                    <div key={record.stopwatch_id} className={styles.timeRecord}>
                      <span className={styles.mainRecord}>
                        {record.highlight_name} : {formatTime(record.start_time)} - {formatTime(record.end_time)}
                      </span>
                      {getStopwatchPauseAndContinueTimes(record.stopwatch_id).map((time, index) => (
                        <div key={index} className={styles.pauseRecord}>
                          <span>{time[0]} - {time[1]}</span>
                        </div>
                      ))}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}  */}
      {activeTab === 'Stopwatch' && (
  <div className={styles.focusRecord}>
            <Title order={3} className={styles.title}>Stopwatch Focus Records</Title>

    {Object.keys(groupedRecordsStopwatch)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())  // Sorting dates in descending order
      .map((date) => (
        <div key={date} className={styles.dateGroup}>
          <div className={styles.date}>{date}</div>
          <div className={styles.timeline}>
            {groupedRecordsStopwatch[date]
              .sort((a, b) => new Date(b.end_time).getTime() - new Date(a.end_time).getTime())
              .map((record) => (
                <div key={record.stopwatch_id} className={styles.timeRecord}>
                  <span className={styles.mainRecord}>
                    {record.highlight_name} : {formatTime(record.start_time)} - {formatTime(record.end_time)}
                  </span>
                  {getStopwatchPauseAndContinueTimes(record.stopwatch_id).map((time, index) => (
                    <div key={index} className={styles.pauseRecord}>
                      <span>{time[0]} - {time[1]}</span>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      ))}
  </div>
)}

    </div>
  );
};

export default FocusSummary;
