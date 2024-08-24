export interface mTimer {
          timer_id: string;
          timer_name: string;
          pomo_duration: TimeRanges;
          short_break_duration: TimeRanges;
          long_break_duration: TimeRanges;
          pomos_per_long_break: number;
          
}

export interface mPomo_details {
    timer_id: number;
    highlight_id: number; // Changed from string to number
    user_id: number;
    start_time: string;   // Assuming ISO 8601 string format for time
    end_time: string;     // Assuming ISO 8601 string format for time
    status: string;
}

export interface mPauses_details {
    pauses_pomo_id: number;
    highlight_id: number; // Changed from string to number
    // user_id: number;
    pause_time: string;   // Assuming ISO 8601 string format for time
    continue_time: string;     // Assuming ISO 8601 string format for time
    
}
export interface mStopwatch_Pauses_details {
    pauses_stopwatch_id: number;
    highlight_id: number; // Changed from string to number
    // user_id: number;
    pause_time: string;   // Assuming ISO 8601 string format for time
    continue_time: string;     // Assuming ISO 8601 string format for time
    
}

export interface mTimeRecord {
    pomo_id: number; 
    highlight_id: number;
    highlight_name: string;
    start_time: string;
    end_time: string;
    pause_and_continue_times: string[][];
}
export interface mStopwatchTimeRecord {
    stopwatch_id: number; 
    highlight_id: number;
    highlight_name: string;
    start_time: string;
    end_time: string;
    pause_and_continue_times: string[][];
}
export interface mPauseContinueDetails {
    pomo_id: number; 
    start_time: string;
    highlight_id: number;
    pause_time: string;
    continue_time?: string;
}
export interface mStopwatchPauseContinueDetails {
    stopwatch_id: number; 
    start_time: string;
    highlight_id: number;
    pause_time: string;
    continue_time?: string;
}
export interface StartDetails {
    timer_id: number;
    highlight_id: number; // Changed from string to number
    user_id: number;
    start_time: string;  
    // end_time: string;    
    status: string;
  }
  export interface EndDetails {
    pomo_id: number;
    timer_id: number;
    highlight_id: number; // Changed from string to number
    user_id: number;
    start_time: string;   // Assuming ISO 8601 string format for time
    end_time: string;     // Assuming ISO 8601 string format for time
    status: string;
  }
  export interface EndStopwatchDetails {
    stopwatch_id: number;
    timer_id: number;
    highlight_id: number; // Changed from string to number
    user_id: number;
    start_time: string;   // Assuming ISO 8601 string format for time
    end_time: string;     // Assuming ISO 8601 string format for time
    status: string;
  }

  export interface ActiveHighlightDetails {
    pomo_id: number;
    highlight_id: number;
}

export interface ActiveStopwatchDetails {
    stopwatch_id: number;
    highlight_id: number;
}