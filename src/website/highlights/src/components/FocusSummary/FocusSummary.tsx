import React from "react";
import { Timeline, Text } from "@mantine/core";
import {
  IconGitBranch,
  IconGitPullRequest,
  IconGitCommit,
  IconMessageDots,
} from "@tabler/icons-react";
import styles from "./FocusSummary.module.css";

const FocusSummary = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Overview</h2>
      <div className={styles.overview}>
        <div className={styles.card}>
          <div className={styles.label}>Today's Pomo</div>
          <div className={styles.value}>0</div>
        </div>
        <div className={styles.card}>
          <div className={styles.label}>Today's Focus</div>
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

      <h2 className={styles.title}>Focus Record</h2>
      <div className={styles.focusRecord}>
        {/* Sample focus records, replace with dynamic content */}
        <div className={styles.record}>
          <div className={styles.date}>Jun 28</div>
          <div className={styles.timeRecord}>
            <span>1:03 - 0:24</span>
            <span>0m</span>
          </div>
          <div className={styles.timeRecord}>
            <span>0:43 - 1:03</span>
            <span>20m</span>
          </div>
        </div>
        <div className={styles.record}>
          <div className={styles.date}>Jun 26</div>
          <div className={styles.timeRecord}>
            <span>17:24 - 20:53</span>
            <span>3h 28m</span>
          </div>
        </div>
        {/* Add more records as needed */}
      </div>
    </div>
  );
};

export default FocusSummary;
