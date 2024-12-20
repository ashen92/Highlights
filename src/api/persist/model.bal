import ballerina/persist as _;
import ballerina/time;
import ballerinax/persist.sql;

type User record {|
    @sql:Generated
    readonly int id;
    string sub;
    byte[]? photo;
    UserLinkedAccount[] userlinkedaccount;
    TaskList[] tasklist;
    Timer[] timer;
    Pomodoro[] pomodoro;
    Stopwatch[] stopwatch;
    Task[] task;
    Issues[] issues;
	FeatureUsageLogs[] featureusagelogs;
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
    string? email;
|};

type TaskList record {|
    @sql:Generated
    readonly int id;
    User user;
    string title;
    time:Civil createdAt;

|};

type Task record {|
    @sql:Generated
    readonly int id;
    string title;
    string? description;
    time:Civil? dueDate;
    time:Civil? startTime;
    time:Civil? endTime;
    string? reminder;
    string priority;
    string label;
    string status;
    time:Civil? completionTime;
    Highlight[] highlight;
    User user;
	Stopwatch[] stopwatch;
	Pomodoro[] pomodoro;
|};

type Highlight record {|
    @sql:Generated
    readonly int id;
    Task task;
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
    Task task;
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
    Task task;
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

// type Project record {|
//     @sql:Generated
//     readonly int id;
//     string name;
// |};

type DailyTip record {|
    @sql:Generated
    readonly int id;
    string label;
    string tip;
    int rate;
    time:Date date;
|};

type Issues record {|
    @sql:Generated
    readonly int id;
    string title;
    string? description;
    time:Civil? dueDate;
    User user;
|};

type assignees record {|
    readonly int taskId;
    readonly string assignee;
    int userId;
|};

type projects record {|
    @sql:Generated
    readonly int id;
    string projectName;
    string progress;
    time:Date startDate;
    time:Date duetDate;
    string priority;
    int percentage;
    string email;

|};

type taskss record {|
    @sql:Generated
    readonly int taskId;
    string taskName;
    string progress;
    string priority;
    time:Date startDate;
    time:Date duetDate;
    int projectId;
    int percentage;

|};

type UserPreferences record {|
    @sql:Generated
    readonly int id;
    int user_id;
    string label;
|};
type FeatureUsageLogs record{|
    @sql:Generated
    readonly int id;
    string feature;
    User user;
    time:Civil time;

|};

