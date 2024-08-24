import ballerina/persist as _;
import ballerina/time;
import ballerinax/persist.sql;

type User record {|
    @sql:Generated
    readonly int id;
    string sub;
    TaskList[] tasklist;
    Timer[] timer;
|};

type TaskList record {|
    @sql:Generated
    readonly int id;
    User user;
    string title;
    time:Civil createdAt;
    Task[] task;
|};

type Task record {|
    @sql:Generated
    readonly int id;
    TaskList taskList;
    string title;
    string? description;
    time:Civil? dueDate;
    time:Civil? startTime;
    time:Civil? endTime;
    string? reminder;
    string priority;
    string label;
    string status;
    Highlight[] highlight;
|};

type Highlight record {|
    @sql:Generated
    readonly int id;
    Task task;
    Stopwatch[] stopwatch;
    Pomodoro[] pomodoro;
|};

type Timer record {|
    @sql:Generated
    readonly int id;
    string name;
    time:Civil pomoDuration;
    time:Civil shortBreakDuration;
    time:Civil longBreakDuration;
    int pomosPerLongBreak;
    User user;
    Pomodoro? pomodoro;
    Stopwatch? stopwatch;
|};

type Pomodoro record {|
    @sql:Generated
    readonly int id;
    Timer timer;
    Highlight highlight;
    time:Civil startTime;
    time:Civil endTime;
    string status;
    PausePomodoro? pausepomodoro;
|};

type Stopwatch record {|
    @sql:Generated
    readonly int id;
    Timer timer;
    Highlight highlight;
    time:Civil startTime;
    time:Civil endTime;
    string status;
    PauseStopwatch? pausestopwatch;
|};

type PausePomodoro record {|
    @sql:Generated
    readonly int id;
    Pomodoro pomodoro;
    time:Civil pauseTime;
    time:Civil continueTime;
|};

type PauseStopwatch record {|
    @sql:Generated
    readonly int id;
    Stopwatch stopwatch;
    time:Civil pauseTime;
    time:Civil continueTime;
|};

type Review record {|
    @sql:Generated
    readonly int id;
    string description;
|};

type Project record {|
    @sql:Generated
    readonly int id;
    string name;
|};

type DailyTip record {|
    @sql:Generated
    readonly int id;
    string label;
    string tip;
    // time:Date date;
|};
