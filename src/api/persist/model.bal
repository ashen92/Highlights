import ballerina/persist as _;
import ballerina/time;
import ballerinax/persist.sql;

type User record {|
    @sql:Generated
    readonly int id;
    string sub;
    UserLinkedAccount[] userlinkedaccount;
    TaskList[] tasklist;
    Timer[] timer;
    Pomodoro[] pomodoro;
    Stopwatch[] stopwatch;
    Task[] task;
|};

type LinkedAccount record {|
    @sql:Generated
    readonly int id;
    string name;
    UserLinkedAccount[] userlinkedaccount;
|};

type UserLinkedAccount record {|
    @sql:Generated
    readonly int id;
    User user;
    LinkedAccount linkedaccount;
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
    User user;
|};

type Highlight record {|
    @sql:Generated
    readonly int id;
    Task task;
    Stopwatch[] stopwatch;
    Pomodoro[] pomodoro;
    PausePomodoro[] pausepomodoro;
    PauseStopwatch[] pausestopwatch;
|};

type Timer record {|
    @sql:Generated
    readonly int id;
    string name;
    time:TimeOfDay pomoDuration;
    time:TimeOfDay shortBreakDuration;
    time:TimeOfDay longBreakDuration;
    int pomosPerLongBreak;
    User user;
    Pomodoro[] pomodoro;
    Stopwatch[] stopwatch;
|};

type Pomodoro record {|
    @sql:Generated
    readonly int id;
    Timer timer;
    Highlight highlight;
    time:Civil startTime;
    time:Civil? endTime;
    string status;
    User user;
    PausePomodoro[] pausepomodoro;
|};

type Stopwatch record {|
    @sql:Generated
    readonly int id;
    Timer timer;
    Highlight highlight;
    time:Civil startTime;
    time:Civil? endTime;
    string status;
    User user;
    PauseStopwatch[] pausestopwatch;
|};

type PausePomodoro record {|
    @sql:Generated
    readonly int id;
    time:Civil pauseTime;
    time:Civil? continueTime;
    Highlight highlight;
    Pomodoro pomodoro;
|};

type PauseStopwatch record {|
    @sql:Generated
    readonly int id;
    Stopwatch stopwatch;
    time:Civil pauseTime;
    time:Civil? continueTime;
    Highlight highlight;
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
|};
