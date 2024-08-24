import webapp.backend.database;
import webapp.backend.http_listener;
import webapp.backend.lists as _;
import webapp.backend.users as _;

import ballerina/http;
import ballerina/io;
import ballerina/lang.'string as strings;
import ballerina/log;
import ballerina/sql;
import ballerina/time;
import ballerinax/mysql.driver as _;

type Task record {
    int id;
    string title;
    string description;
    string? dueDate;
    string? startTime;
    string? endTime;
    string? reminder;
    string priority;
    string label;
    string status;
};

type CreateTask record {|
    string title;
    string description;
    string? dueDate;
    string? startTime;
    string? endTime;
    string? label;
    string? reminder;
    string priority;

|};

// type CreateSubTask record {|
//     string title;
//     string description;
//     string? dueDate;
//     string? startTime;
//     string? endTime;
//     string? reminder;
//     string priority;
//     int parentTaskId;
// |};

type h_Highlight record {|
    int highlight_id;
    string highlight_name;
    int user_id;
|};

type h_TimerDetails record {|
    int timer_id;
    string timer_name;
    time:TimeOfDay? pomo_duration;
    time:TimeOfDay? short_break_duration;
    time:TimeOfDay? long_break_duration;
    int pomos_per_long_break;
    int user_id;
|};

// type HighlightPomoDetails record {
//     int timer_id;
//     int highlight_id;
//     int user_id;
//     time:Utc start_time;
//     time:Utc end_time;
//     string status;
// };

// Intermediate record type for deserialization
// type h_HighlightPomoDetailsTemp record {
//     int timer_id;
//     int highlight_id;
//     int user_id;
//     string start_time;
//     string end_time;
//     string status;
// };

type h_HighlightPomoStartDetails record {
    int timer_id;
    int highlight_id;
    int user_id;
    time:Utc start_time;
    string status;
};

// Intermediate record type for deserialization
type h_HighlightPomoStartDetailsTemp record {
    int timer_id;
    int highlight_id;
    int user_id;
    string start_time;
    string status;
};

type h_HighlightPomoEndDetails record {
    int pomo_id;
    int timer_id;
    int highlight_id;
    int user_id;
    time:Utc end_time;
    string status;
};

// Intermediate record type for deserialization
type h_HighlightPomoEndDetailsTemp record {
    int pomo_id;
    int timer_id;
    int highlight_id;
    int user_id;
    string end_time;
    string status;
};

type h_HighlightStopwatchEndDetails record {
    int stopwatch_id;
    int timer_id;
    int highlight_id;
    int user_id;
    time:Utc end_time;
    string status;
};

// Intermediate record type for deserialization
type h_HighlightStopwatchEndDetailsTemp record {
    int stopwatch_id;
    int timer_id;
    int highlight_id;
    int user_id;
    string end_time;
    string status;
};

type PausesDetails record {
    int pomo_id;
    int highlight_id;
    string pause_time;
    // string continue_time;
};

type PausesDetailsTemp record {
    int pomo_id;
    int highlight_id;
    string pause_time;
    // string continue_time;
};

type h_stopwatch_PausesDetails record {
    int stopwatch_id;
    int highlight_id;
    string pause_time;
    // string continue_time;
};

type h_stopwatch_PausesDetailsTemp record {
    int stopwatch_id;
    int highlight_id;
    string pause_time;
    // string continue_time;
};

type ContinueDetails record {
    int pomo_id;
    int highlight_id;
    // string pause_time;
    string continue_time;
};

type ContinueDetailsTemp record {
    int pomo_id;
    int highlight_id;
    // string pause_time;
    string continue_time;
};

type h_stopwatch_ContinueDetails record {
    int stopwatch_id;
    int highlight_id;
    // string pause_time;
    string continue_time;
};

type h_stopwatch_ContinueDetailsTemp record {
    int stopwatch_id;
    int highlight_id;
    // string pause_time;
    string continue_time;
};

type h_HighlightStopwatchStartDetails record {
    int timer_id;
    int highlight_id;
    int user_id;
    time:Utc start_time;
    string status;
};

// Intermediate record type for deserialization
type h_HighlightStopwatchStartDetailsTemp record {
    int timer_id;
    int highlight_id;
    int user_id;
    string start_time;
    string status;
};

type TimeRecord record {
    int pomo_id;
    int highlight_id;
    string highlight_name;
    string start_time;
    string end_time;
    string[][] pause_and_continue_times;
};

type h_StopwatchTimeRecord record {
    int stopwatch_id;
    int highlight_id;
    string highlight_name;
    string start_time;
    string end_time;
    string[][] pause_and_continue_times;
};

type FocusRecord record {
    string highlight_id;
    time:TimeOfDay start_time;
    time:TimeOfDay end_time;
};

type PauseContinueDetails record {
    string highlight_id;
    time:TimeOfDay pause_time;
    time:TimeOfDay continue_time;
};

type FocusSummary record {
    FocusRecord focusRecord;
    PauseContinueDetails[] pauseContinueDetails;
};

type PauseContinueRecord record {

    string pause_time;
    string continue_time?;
};

// Define a record to hold the highlight details
type HighlightRecord record {
    int highlight_id;
    string start_time;
    string end_time;
    PauseContinueRecord[] pause_and_continue_times;
};

type h_PauseContinueDetails record {|
    int pomo_id;
    int highlight_id;
    string pause_time;
    string? continue_time;
|};

type h_Stopwatch_PauseContinueDetails record {|
    int stopwatch_id;
    int highlight_id;
    string pause_time;
    string? continue_time;
|};

type h_ActiveHighlightDetails record {|
    int pomo_id;
    int highlight_id;
|};

type h_ActiveStopwatchDetails record {|
    int stopwatch_id;
    int highlight_id;
|};

type DailyTip record {
    int id;
    string label;
    string tip;
    // time:Date date;
};

type CreateDailyTip record {|
    string label;
    string tip;
    // time:Date date;
|};

type review record {|
    string id;
    string description;
|};

// listener http:Listener securedEP = new (9090);

// Define the configuration variables
configurable string azureAdIssuer = ?;
configurable string azureAdAudience = ?;

type PauseAndContinueTime record {

};

@http:ServiceConfig {
    // auth: [
    //     {
    //         jwtValidatorConfig: {
    //             issuer: azureAdIssuer,
    //             audience: azureAdAudience,
    //             scopeKey: "scp"
    //         },
    //         scopes: ["User.Read"]
    //     }
    // ],
    // auth: [
    //     {
    //         jwtValidatorConfig: {
    //             issuer: azureAdIssuer,
    //             audience: azureAdAudience,
    //             scopeKey: "scp"
    //         },
    //         scopes: ["User.Read"]
    //     }
    // ],
    cors: {
        allowOrigins: ["http://localhost:3000"],
        allowCredentials: false,
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
        maxAge: 84900
    }
}
service / on http_listener:Listener {

    //  resource function get tasks() returns Task[]|error {
    //         sql:ParameterizedQuery query = `SELECT id,title, dueDate, startTime, endTime, label, reminder, priority, description , status FROM hi`;
    //         stream<Task, sql:Error?> resultStream = self.db->query(query);
    //         Task[] tasksList = [];
    //         error? e = resultStream.forEach(function(Task task) {
    //             tasksList.push(task);
    //         });
    //         if (e is error) {
    //             log:printError("Error occurred while fetching tasks: ", 'error = e);
    //             return e;
    //         }
    // // io:print(tasklist);
    // io:println(tasksList);
    //         return tasksList;
    //     }

    private function fetchTasksForToday() returns Task[]|error {
        sql:ParameterizedQuery query = `SELECT id, title, dueDate, startTime, endTime, label, reminder, priority, description, status
                                        FROM hi
                                        WHERE dueDate = CURRENT_DATE`;

        stream<Task, sql:Error?> resultStream = database:Client->query(query);
        Task[] tasksList = [];
        error? e = resultStream.forEach(function(Task task) {
            tasksList.push(task);
        });

        if (e is error) {
            log:printError("Error occurred while fetching tasks: ", 'error = e);
            return e;
        }

        check resultStream.close();
        return tasksList;
    }

    resource function get tasks() returns Task[]|error {
        return self.fetchTasksForToday();
    }

    resource function post tasks(http:Caller caller, http:Request req) returns error? {
        json|http:ClientError payload = req.getJsonPayload();
        if payload is http:ClientError {
            log:printError("Error while parsing request payload", 'error = payload);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        CreateTask|error task = payload.cloneWithType(CreateTask);
        if task is error {
            log:printError("Error while converting JSON to Task", 'error = task);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        // Convert ISO 8601 date to MySQL compatible date format
        string dueDate = task.dueDate != () ? formatDateTime(task.dueDate.toString()) : "";
        string startTime = task.startTime != () ? formatTime(task.startTime.toString()) : "";
        string endTime = task.endTime != () ? formatTime(task.endTime.toString()) : "";

        sql:ExecutionResult|sql:Error result = database:Client->execute(`
        INSERT INTO hi (title, dueDate, startTime, endTime, label, reminder, priority, description) 
        VALUES (${task.title}, ${dueDate}, ${startTime}, ${endTime}, ${task.label} ,${task.reminder}, ${task.priority}, ${task.description});
    `);

        if result is sql:Error {
            log:printError("Error occurred while inserting task", 'error = result);
            check caller->respond(http:STATUS_INTERNAL_SERVER_ERROR);
        }

        Task[]|error tasks = self.fetchTasksForToday();
        if (tasks is error) {
            log:printError("Error occurred while fetching tasks: ", 'error = tasks);
            check caller->respond(http:STATUS_INTERNAL_SERVER_ERROR);
            return;
        }

        // io:println(tasks);

        check caller->respond(tasks);

        // } else {
        //     check caller->respond(http:STATUS_CREATED);
        // }
    }

    resource function put tasks/[int taskId](http:Caller caller, http:Request req) returns error? {

        json|http:ClientError payload = req.getJsonPayload();
        if payload is http:ClientError {
            log:printError("Error while parsing request payload", 'error = payload);

            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        Task|error task = payload.cloneWithType(Task);
        if task is error {
            log:printError("Error while converting JSON to Task", 'error = task);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        // Convert ISO 8601 date to MySQL compatible date format
        string dueDate = task.dueDate != () ? formatDateTime(task.dueDate.toString()) : "";
        string startTime = task.startTime != () ? formatTime(task.startTime.toString()) : "";
        string endTime = task.endTime != () ? formatTime(task.endTime.toString()) : "";

        sql:ExecutionResult|sql:Error result = database:Client->execute(`
        UPDATE hi SET title = ${task.title}, 
                      dueDate = ${dueDate}, 
                      startTime = ${startTime}, 
                      endTime = ${endTime}, 
                      reminder = ${task.reminder}, 
                      priority = ${task.priority}, 
                      description = ${task.description}
        WHERE id = ${taskId};
    `);

        if result is sql:Error {
            log:printError("Error occurred while updating task", 'error = result);
            check caller->respond(http:STATUS_INTERNAL_SERVER_ERROR);
        } else {
            check caller->respond(http:STATUS_OK);
        }
    }

    resource function post addTask(http:Caller caller, http:Request req) returns error? {
        json payload = check req.getJsonPayload();

        string taskName = (check payload.taskName).toString();
        string progress = (check payload.progress).toString();
        string priority = (check payload.priority).toString();
        // json assignees = check payload.assignees;
        // string assigneesJson = assignees.toString();
        string startDate = (check payload.startDate).toString();
        string dueDate = (check payload.dueDate).toString();
        int projectId = (check payload.projectId);

        sql:ParameterizedQuery insertQuery = `INSERT INTO taskss (taskName,progress, priority, startDate, dueDate,projectId) VALUES (${taskName},${progress}, ${priority}, ${startDate}, ${dueDate},${projectId})`;
        _ = check database:Client->execute(insertQuery);

        sql:ParameterizedQuery selectQuery = `SELECT taskName,progress, priority,  startDate, dueDate FROM taskss`;
        stream<record {|anydata...;|}, sql:Error?> resultStream = database:Client->query(selectQuery);

        json[] resultJsonArray = [];
        check from record {|anydata...;|} row in resultStream
            do {
                resultJsonArray.push(row.toJson());
            };

        json response = {projects: resultJsonArray};
        http:Response res = new;
        res.setPayload(response);
        // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        check caller->respond(res);

        return;
    }

    resource function post addProjects(http:Caller caller, http:Request req) returns error? {
        io:print("this inside add project");
        json payload = check req.getJsonPayload();

        string projectName = (check payload.projectName).toString();
        string progress = (check payload.progress).toString();
        string priority = (check payload.priority).toString();
        // json assignees = check payload.assignees;
        // string assigneesJson = assignees.toString();
        string startDate = (check payload.startDate).toString();
        string dueDate = (check payload.dueDate).toString();

        sql:ParameterizedQuery insertQuery = `INSERT INTO projects (projectName,progress, priority, startDate, dueDate) VALUES (${projectName},${progress}, ${priority}, ${startDate}, ${dueDate})`;
        _ = check database:Client->execute(insertQuery);

        sql:ParameterizedQuery selectQuery = `SELECT id,projectName,progress, priority,  startDate, dueDate FROM projects`;
        stream<record {|anydata...;|}, sql:Error?> resultStream = database:Client->query(selectQuery);

        json[] resultJsonArray = [];
        check from record {|anydata...;|} row in resultStream
            do {
                resultJsonArray.push(row.toJson());
            };

        json response = {projects: resultJsonArray};
        http:Response res = new;
        res.setPayload(response);
        // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        check caller->respond(res);

        return;
    }

    /////////////////////////////////////////////////////////
    resource function get projects(http:Caller caller, http:Request req) returns error? {

        sql:ParameterizedQuery selectQuery = `SELECT id,projectName,progress, priority,  startDate, dueDate FROM projects`;
        stream<record {|anydata...;|}, sql:Error?> resultStream = database:Client->query(selectQuery);

        json[] resultJsonArray = [];
        check from record {|anydata...;|} row in resultStream
            do {
                resultJsonArray.push(row.toJson());
            };
        io:println("totl projects", resultJsonArray);

        json response = {projects: resultJsonArray};
        http:Response res = new;
        res.setPayload(response);
        // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        check caller->respond(res);

        return;
    }

    // New resource function to update project details
    resource function put updateProject(http:Caller caller, http:Request req) returns error? {
        json payload = check req.getJsonPayload();

        int projectId = check payload.id;
        string projectName = (check payload.projectName).toString();
        string progress = (check payload.progress).toString();
        string priority = (check payload.priority).toString();
        // time:Utc startDate = time:format(payload.startDate, "yyyy-MM-dd");
        // time:Utc dueDate = (check payload.dueDate);
        // string startDateStr = time:format(payload.startDate, "yyyy-MM-dd'T'HH:mm:ss'Z'");
        int? indexOfT = strings:indexOf(check payload.startDate, "T");

        // Extract the date part (before 'T')
        string startDate = strings:substring(check payload.startDate, 0, <int>indexOfT);

        int? indexOfT2 = strings:indexOf(check payload.dueDate, "T");

        // Extract the date part (before 'T')
        string dueDate = strings:substring(check payload.dueDate, 0, <int>indexOfT2);

        // string startDate =(check payload.startDate).toString();
        // string dueDate =(check payload.startDate).toString();
        io:println("Formatted Due Date: ", payload.startDate);
        // time:Utc dateTime = check time:parse(dateTimeString, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

        sql:ParameterizedQuery updateQuery = `UPDATE projects SET projectName = ${projectName}, progress = ${progress}, priority = ${priority},startDate=${startDate},dueDate=${dueDate}   WHERE id = ${projectId}`;
        _ = check database:Client->execute(updateQuery);

        json response = {message: "Project updated successfully"};
        http:Response res = new;
        res.setPayload(response);
        // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        check caller->respond(res);

        return;
    }

    // New resource function to get details of a specific project based on project id
    resource function get project/[int projectId](http:Caller caller, http:Request req) returns error? {
        // Prepare the SQL query to select project details by ID
        sql:ParameterizedQuery selectQuery = `SELECT id, projectName, progress, priority, startDate, dueDate FROM projects WHERE id = ${projectId}`;

        // Execute the query and get the result stream
        stream<record {|anydata...;|}, sql:Error?> resultStream = database:Client->query(selectQuery);

        // Variables to hold project details and response
        record {|anydata...;|}? projectDetails;
        json response;

        // Iterate through the result stream

        projectDetails = check resultStream.next();
        // if (projectDetails is record {| anydata...; |}) {
        //     response = resultStream.toJson();
        //     break; // Found the project, exit the loop
        // }
        // json[] resultJsonArray = [];
        // check from record {| anydata...; |} row in resultStream
        //     do {
        //        response.push(row.toJson());
        //     };
        response = projectDetails.toJson();

        // If projectDetails is still empty, project not found
        // if (projectDetails == ()) {
        //     response.push( "Project not found" );
        // }
        io:println(resultStream);
        io:println(response);
        io:println(projectId);
        io:println(projectDetails);

        // Create and set HTTP response
        http:Response res = new;
        res.setPayload(response);
        // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        check caller->respond(res);

        return;
    }

    resource function put updateTask(http:Caller caller, http:Request req) returns error? {
        json payload = check req.getJsonPayload();

        int projectId = <int>check payload.projectId;
        string taskName = (check payload.taskName).toString();
        string progress = (check payload.progress).toString();
        string priority = (check payload.priority).toString();

        int? indexOfT = strings:indexOf(check payload.startDate, "T");

        // Extract the date part (before 'T')
        string startDate = strings:substring(check payload.startDate, 0, <int>indexOfT);

        int? indexOfT2 = strings:indexOf(check payload.dueDate, "T");

        // Extract the date part (before 'T')
        string dueDate = strings:substring(check payload.dueDate, 0, <int>indexOfT2);

        io:println("Formatted Due Date: ", payload.startDate);

        sql:ParameterizedQuery updateQuery = `UPDATE taskss SET taskName = ${taskName}, progress = ${progress}, priority = ${priority},startDate=${startDate},dueDate=${dueDate}   WHERE taskName = ${taskName} AND projectId=${projectId}`;
        _ = check database:Client->execute(updateQuery);

        json response = {message: "Task updated successfully"};
        http:Response res = new;
        res.setPayload(response);
        // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        check caller->respond(res);

        return;
    }

    resource function get tasks/[int projectId](http:Caller caller, http:Request req) returns error? {

        sql:ParameterizedQuery selectQuery = `SELECT projectId,taskName,progress, priority,  startDate, dueDate FROM taskss WHERE projectId=${projectId}`;
        stream<record {|anydata...;|}, sql:Error?> resultStream = database:Client->query(selectQuery);

        json[] resultJsonArray = [];
        check from record {|anydata...;|} row in resultStream
            do {
                resultJsonArray.push(row.toJson());
            };
        io:println("totl projects", resultJsonArray);

        json response = {projects: resultJsonArray};
        http:Response res = new;
        res.setPayload(response);
        // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        check caller->respond(res);

        return;
    }

    // Handle preflight OPTIONS request for CORS
    // resource function options tasks/[int projectId](http:Caller caller, http:Request req) returns error? {
    //     http:Response response = new;
    //     response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    //     response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    //     response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    //     check caller->respond(response);

    //     return;
    // }

    // resource function get highlights() returns Highlight[] {
    //     return highlights;
    // }

    resource function delete tasks/[int taskId](http:Caller caller) returns error? {
        io:println("xdd");
        sql:ExecutionResult|sql:Error result = database:Client->execute(`
            DELETE FROM hi WHERE id = ${taskId};
        `);

        if result is sql:Error {
            log:printError("Error occurred while deleting task", result);
            check caller->respond(http:STATUS_INTERNAL_SERVER_ERROR);
        } else {
            check caller->respond(http:STATUS_OK);
        }
    }

    // Create a new daily tip
    private function tipps(CreateDailyTip dailyTip) returns error? {
        io:println("cc");
        sql:ExecutionResult|sql:Error result = database:Client->execute(`
            INSERT INTO dailytips (label, tip) VALUES (${dailyTip.label}, ${dailyTip.tip});
        `);

        if (result is sql:ApplicationError) {
            log:printError("Error occurred while inserting daily tip", 'error = result);
            return result;
        }
        return ();
    }

    // Fetch daily tips
    private function fetchDailyTips() returns DailyTip[]|error {
        sql:ParameterizedQuery query = `SELECT id, label, tip FROM dailytips`;
        stream<DailyTip, sql:Error?> resultStream = database:Client->query(query);
        DailyTip[] dailyTipList = [];
        error? e = resultStream.forEach(function(DailyTip dailyTip) {
            dailyTipList.push(dailyTip);
        });

        if (e is error) {
            log:printError("Error occured while fetching daily tips: ", 'error = e);
            return e;
        }

        check resultStream.close();
        return dailyTipList;
    }

    // Update a dailytip by ID
    private function updateDailyTip(int tipId, string label, string tip) returns error? {
        sql:ExecutionResult|sql:Error result = database:Client->execute(`
            UPDATE dailytips SET label = ${label}, tip = ${tip} WHERE id = ${tipId};
        `);

        if (result is sql:Error) {
            log:printError("Error occurred while updating daily tip", 'error = result);
            return result;
        }

        return ();
    }

    // Endpoint to create a new daily tip
    resource function POST tips(http:Caller caller, http:Request req) returns error? {
        io:println("ccmmm");
        json|http:ClientError payload = req.getJsonPayload();
        if (payload is http:ClientError) {
            log:printError("Error while parsing request payload", 'error = payload);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }
        CreateDailyTip|error dailyTip = payload.cloneWithType(CreateDailyTip);
        if (dailyTip is error) {
            log:printError("Error while converting JSON to CreateDailyTip", 'error = dailyTip);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        error? result = self.tipps(dailyTip);
        if (result is error) {
            check caller->respond(http:STATUS_INTERNAL_SERVER_ERROR);
            return;
        }

        check caller->respond(http:STATUS_CREATED);
    }

    // Endpoint to fetch daily tips
    resource function GET all() returns DailyTip[]|error {
        return self.fetchDailyTips();
    }

    // Endpoint to update a daily tip
    resource function PUT updatetips(int tipId, http:Caller caller, http:Request req) returns error? {
        json|http:ClientError payload = req.getJsonPayload();
        io:print("*************");

        if (payload is http:ClientError) {
            log:printError("Error while parsing request payload", 'error = payload);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        CreateDailyTip|error dailyTip = payload.cloneWithType(CreateDailyTip);
        if (dailyTip is error) {
            log:printError("Error while converting JSON to CreateDailyTip", 'error = dailyTip);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        error? result = self.updateDailyTip(tipId, dailyTip.tip, dailyTip.label);
        if (result is error) {
            check caller->respond(http:STATUS_INTERNAL_SERVER_ERROR);
            return;
        }

        check caller->respond(http:STATUS_OK);
    }

    resource function get timer_details() returns h_TimerDetails[]|error {

        sql:ParameterizedQuery sqlQuery = `SELECT * FROM Timer`;

        // Execute the query and retrieve the results
        stream<record {|
            int id;
            string name;
            time:TimeOfDay? pomoDuration;
            time:TimeOfDay? shortBreakDuration;
            time:TimeOfDay? longBreakDuration;
            int pomosPerLongBreak;
            int userId;
        |}, sql:Error?> resultStream = database:Client->query(sqlQuery);

        h_TimerDetails[] h_timerDetailsList = [];

        // Iterate over the results

        // Iterate over the results
        check from var timerDetail in resultStream
            do {
                log:printInfo("Retrieved TimerDetail: " + timerDetail.toString());
                h_timerDetailsList.push({
                    timer_id: timerDetail.id,
                    timer_name: timerDetail.name,
                    pomo_duration: timerDetail.pomoDuration,
                    short_break_duration: timerDetail.shortBreakDuration,
                    long_break_duration: timerDetail.longBreakDuration,
                    pomos_per_long_break: timerDetail.pomosPerLongBreak,
                    user_id: timerDetail.userId
                });
            };

        // io:println(h_timerDetailsList);

        return h_timerDetailsList;
    }

    // Function to get highlights from the database
    resource function get highlights() returns h_Highlight[]|error {

        sql:ParameterizedQuery sqlQuery = `SELECT id, title, userId FROM TaskList`;

        // Execute the query and retrieve the results
        stream<record {|
            int id;
            string title;
            int userId;
        |}, sql:Error?> resultStream = database:Client->query(sqlQuery);

        h_Highlight[] highlightList = [];

        // Iterate over the results
        check from var highlight in resultStream
            do {
                log:printInfo("Retrieved Highlight: " + highlight.toString());
                highlightList.push({
                    highlight_id: highlight.id,
                    highlight_name: highlight.title,
                    user_id: highlight.userId
                });
            };

        // io:println(highlightList);

        return highlightList;
    }

    resource function post end_pomo_details(http:Caller caller, http:Request req) returns error? {

        json|http:ClientError payload = req.getJsonPayload();

        if payload is http:ClientError {
            log:printError("Error while parsing request payload (pomo_details)", 'error = payload);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        h_HighlightPomoEndDetailsTemp tempDetails = check payload.cloneWithType(h_HighlightPomoEndDetailsTemp);

        time:Utc|error endTime = time:utcFromString(tempDetails.end_time);

        if (endTime is error) {
            log:printError("Error parsing end_time", 'error = endTime);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        time:Utc adjustedEndTime = time:utcAddSeconds(endTime, +(5 * 3600 + 30 * 60));

        h_HighlightPomoEndDetails highlightPomoDetails = {
            pomo_id: tempDetails.pomo_id,
            timer_id: tempDetails.timer_id,
            highlight_id: tempDetails.highlight_id,
            user_id: tempDetails.user_id,
            end_time: adjustedEndTime,
            status: tempDetails.status
        };

        string endTimeStr = time:utcToString(highlightPomoDetails.end_time);

        string formattedEndTime = endTimeStr.substring(0, 10) + " " + endTimeStr.substring(11, 19);

        sql:ExecutionResult|sql:Error result = database:Client->execute(`
            UPDATE Pomodoro 
            SET endTime = ${formattedEndTime}, status = ${highlightPomoDetails.status}
            WHERE id=${highlightPomoDetails.pomo_id} AND highlightId = ${highlightPomoDetails.highlight_id}  ;
        `);

        if result is sql:Error {
            log:printError("Error while inserting data into HighlightPomoDetails", 'error = result);
            check caller->respond(http:STATUS_INTERNAL_SERVER_ERROR);
            return;
        }

        // io:println("Data inserted successfully");
        check caller->respond(http:STATUS_OK);
    }

    resource function post start_pomo_details(http:Caller caller, http:Request req) returns error? {

        json|http:ClientError payload = req.getJsonPayload();

        if payload is http:ClientError {
            log:printError("Error while parsing request payload (highlight_start_pomo_details)", 'error = payload);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        // Convert the payload to the HighlightPomoDetails record
        h_HighlightPomoStartDetailsTemp tempDetails = check payload.cloneWithType(h_HighlightPomoStartDetailsTemp);
        io:println("Received highlightPomoDetails:", tempDetails);

        // Convert start_time and end_time strings to time:Utc
        time:Utc|error startTime = time:utcFromString(tempDetails.start_time);

        if (startTime is error) {
            log:printError("Error parsing start_time or end_time", 'error = startTime);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }
        time:Utc adjustedStartTime = time:utcAddSeconds(startTime, +(5 * 3600 + 30 * 60));
        // Create HighlightPomoDetails record
        h_HighlightPomoStartDetails highlightDetails = {
            timer_id: tempDetails.timer_id,
            highlight_id: tempDetails.highlight_id,
            user_id: tempDetails.user_id,
            start_time: adjustedStartTime,
            status: tempDetails.status
        };

        string startTimeStr = time:utcToString(highlightDetails.start_time);
        string formattedStartTime = startTimeStr.substring(0, 10) + " " + startTimeStr.substring(11, 19);

        // Insert data into database
        sql:ExecutionResult|sql:Error result = database:Client->execute(`
            INSERT INTO Pomodoro (timerId, highlightId, userId, startTime,  status) 
            VALUES (${highlightDetails.timer_id}, ${highlightDetails.highlight_id}, ${highlightDetails.user_id}, ${formattedStartTime}, ${highlightDetails.status});
        `);

        if result is sql:Error {
            log:printError("Error while inserting data into HighlightPomoDetails", 'error = result);
            check caller->respond(http:STATUS_INTERNAL_SERVER_ERROR);
            return;
        }

        io:println("Started Data inserted successfully");
        check caller->respond(http:STATUS_OK);
    }

    resource function post pause_pomo_details(http:Caller caller, http:Request req) returns error? {

        json|http:ClientError payload = req.getJsonPayload();

        if payload is http:ClientError {
            log:printError("Error while parsing request payload (pause_pomo_details)", 'error = payload);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        // Convert the payload to the h_HighlightPomoDetailsTemp record
        PausesDetailsTemp tempDetails = check payload.cloneWithType(PausesDetailsTemp);
        // io:println("Received highlightPomoDetails:", tempDetails);

        // Convert pause_time string to time:Utc
        time:Utc|error pauseTime = time:utcFromString(tempDetails.pause_time);

        if (pauseTime is error) {
            log:printError("Error parsing pause_time", 'error = pauseTime);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        // Create a negative duration of 5 hours and 30 minutes
        time:Utc adjustedPauseTime = time:utcAddSeconds(pauseTime, +(5 * 3600 + 30 * 60));

        // Convert time:Utc to RFC 3339 string
        string adjustedPauseTimeStr = time:utcToString(adjustedPauseTime);

        // Manual formatting from RFC 3339 to "yyyy-MM-dd HH:mm:ss"
        string formattedPauseTime = adjustedPauseTimeStr.substring(0, 10) + " " + adjustedPauseTimeStr.substring(11, 19);

        // Create PausesDetails record with adjusted times
        PausesDetails pausesDetails = {
            pomo_id: tempDetails.pomo_id,
            highlight_id: tempDetails.highlight_id,
            pause_time: formattedPauseTime
        };

        // Insert data into database
        sql:ExecutionResult|sql:Error result = database:Client->execute(`
        INSERT INTO PausePomodoro (highlightId, pomodoroId,  pauseTime) 
        VALUES (${pausesDetails.highlight_id}, ${pausesDetails.pomo_id}, ${pausesDetails.pause_time});
    `);

        if result is sql:Error {
            log:printError("Error while inserting data into HighlightPomoDetails", 'error = result);
            check caller->respond(http:STATUS_INTERNAL_SERVER_ERROR);
            return;
        }

        // io:println("Data inserted successfully");
        check caller->respond(http:STATUS_OK);
    }

    resource function post continue_pomo_details(http:Caller caller, http:Request req) returns error? {

        json|http:ClientError payload = req.getJsonPayload();

        if payload is http:ClientError {
            log:printError("Error while parsing request payload (continue_pomo_details)", 'error = payload);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        // Convert the payload to the h_HighlightPomoDetailsTemp record
        ContinueDetailsTemp tempDetails = check payload.cloneWithType(ContinueDetailsTemp);
        // io:println("Received highlightContinuePomoDetails:", tempDetails);

        // Convert pause_time string to time:Utc
        time:Utc|error continueTime = time:utcFromString(tempDetails.continue_time);

        if (continueTime is error) {
            log:printError("Error parsing pause_time", 'error = continueTime);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        // Create a negative duration of 5 hours and 30 minutes
        time:Utc adjustedContinueTime = time:utcAddSeconds(continueTime, +(5 * 3600 + 30 * 60));

        // Convert time:Utc to RFC 3339 string
        string adjustedContinueTimeStr = time:utcToString(adjustedContinueTime);

        // Manual formatting from RFC 3339 to "yyyy-MM-dd HH:mm:ss"
        string formattedContinueTime = adjustedContinueTimeStr.substring(0, 10) + " " + adjustedContinueTimeStr.substring(11, 19);

        // Create PausesDetails record with adjusted times
        ContinueDetails continueDetails = {
            pomo_id: tempDetails.pomo_id,
            highlight_id: tempDetails.highlight_id,
            continue_time: formattedContinueTime
        };

        sql:ExecutionResult|sql:Error result = database:Client->execute(`
        UPDATE PausePomodoro 
        SET continueTime = ${continueDetails.continue_time} 
        WHERE highlightId = ${continueDetails.highlight_id} AND  pomodoroId = ${continueDetails.pomo_id}
        AND continueTime IS NULL;
    `);

        if result is sql:Error {
            log:printError("Error while updating data into PausesDetails", 'error = result);
            check caller->respond(http:STATUS_INTERNAL_SERVER_ERROR);
            return;
        }

        // io:println("Data inserted successfully");
        check caller->respond(http:STATUS_OK);
    }

    resource function get focus_record/[int userId]() returns TimeRecord[]|error {
        // Query to get all highlights and their names for the given user with non-null end_time
        sql:ParameterizedQuery highlightQuery = `SELECT hpd.id,hpd.highlightId, hh.title, hpd.startTime, hpd.endTime 
                                             FROM Pomodoro hpd
                                             JOIN TaskList hh ON hpd.highlightId = hh.id
                                             WHERE hpd.userId = ${userId} AND hpd.endTime IS NOT NULL`;
        stream<record {|int id; int highlightId; string title; time:Utc startTime; time:Utc endTime;|}, sql:Error?> highlightStream = database:Client->query(highlightQuery);

        TimeRecord[] highlightTimeRecords = [];

        // Iterate over the highlight results
        check from var highlight in highlightStream
            do {
                string[][] pauseAndContinueTimes = [];

                // Add the duration to start_time and end_time
                time:Utc newStartTime = time:utcAddSeconds(highlight.startTime, +(5 * 3600 + 30 * 60));
                time:Utc newEndTime = time:utcAddSeconds(highlight.endTime, +(5 * 3600 + 30 * 60));

                // Convert time:Utc to RFC 3339 strings
                string startTimeStr = time:utcToString(newStartTime);
                string endTimeStr = time:utcToString(newEndTime);

                // Manual formatting from RFC 3339 to "yyyy-MM-dd HH:mm:ss"
                string formattedStartTime = startTimeStr.substring(0, 10) + " " + startTimeStr.substring(11, 19);
                string formattedEndTime = endTimeStr.substring(0, 10) + " " + endTimeStr.substring(11, 19);

                TimeRecord timeRecord = {
                    pomo_id: highlight.id,
                    highlight_id: highlight.highlightId,
                    highlight_name: highlight.title,
                    start_time: formattedStartTime,
                    end_time: formattedEndTime,
                    pause_and_continue_times: pauseAndContinueTimes
                };

                highlightTimeRecords.push(timeRecord);
            };
        // io:println(highlightTimeRecords);
        return highlightTimeRecords;
    }

    resource function get active_timer_highlight_details/[int userId]() returns h_ActiveHighlightDetails[]|error {
        // SQL query to retrieve active (uncomplete) highlight timer details
        sql:ParameterizedQuery activeTimerQuery = `SELECT 
                                                hpd.id,
                                                hpd.highlightId
                                              FROM 
                                                Pomodoro hpd
                                              WHERE 
                                                hpd.userId = ${userId} 
                                                AND hpd.endTime IS NULL
                                                AND hpd.status = 'uncomplete'`;

        // Execute the query and retrieve the results
        stream<record {|
            int id;
            int highlightId;
        |}, sql:Error?> resultStream = database:Client->query(activeTimerQuery);

        h_ActiveHighlightDetails[] activeHighlightDetails = [];

        // Iterate over the results
        check from var detail in resultStream
            do {
                h_ActiveHighlightDetails highlightDetail = {
                    pomo_id: detail.id,
                    highlight_id: detail.highlightId
                };

                activeHighlightDetails.push(highlightDetail);
            };

        io:println(activeHighlightDetails);

        return activeHighlightDetails;
    }

    resource function get pause_details/[int userId]() returns h_PauseContinueDetails[]|error {
        // SQL query to retrieve pause and continue details by pomo_id and highlight_id
        sql:ParameterizedQuery sqlQuery = `SELECT 
                                        h.id,
                                        h.highlightId, 
                                        p.pauseTime, 
                                        p.continueTime 
                                      FROM 
                                        Pomodoro h 
                                      JOIN 
                                        PausePomodoro p 
                                      ON 
                                        h.id = p.pomodoroId 
                                      WHERE 
                                        h.userId = ${userId}`;

        // Execute the query and retrieve the results
        stream<record {|
            int id;
            int highlightId;
            time:Utc pauseTime;
            time:Utc? continueTime;
        |}, sql:Error?> resultStream = database:Client->query(sqlQuery);

        h_PauseContinueDetails[] pauseContinueDetails = [];

        // Iterate over the results
        check from var pauseDetail in resultStream
            do {
                // Add the duration to pause_time and continue_time
                time:Utc newPauseTime = time:utcAddSeconds(pauseDetail.pauseTime, +(5 * 3600 + 30 * 60));
                time:Utc? newContinueTime = pauseDetail.continueTime != () ? time:utcAddSeconds(<time:Utc>pauseDetail.continueTime, +(5 * 3600 + 30 * 60)) : ();

                // Convert time:Utc to RFC 3339 strings
                string pauseTimeStr = time:utcToString(newPauseTime);
                string? continueTimeStr = newContinueTime != () ? time:utcToString(newContinueTime) : ();

                // Manual formatting from RFC 3339 to "yyyy-MM-dd HH:mm:ss"
                string formattedPauseTime = pauseTimeStr.substring(0, 10) + " " + pauseTimeStr.substring(11, 19);
                string? formattedContinueTime = continueTimeStr != () ? continueTimeStr.substring(0, 10) + " " + continueTimeStr.substring(11, 19) : ();

                h_PauseContinueDetails pauseContinueDetail = {
                    pomo_id: pauseDetail.id,
                    highlight_id: pauseDetail.highlightId,
                    pause_time: formattedPauseTime,
                    continue_time: formattedContinueTime
                };

                pauseContinueDetails.push(pauseContinueDetail);
            };

        io:println(pauseContinueDetails);

        return pauseContinueDetails;
    }

    resource function post start_stopwatch_details(http:Caller caller, http:Request req) returns error? {

        json|http:ClientError payload = req.getJsonPayload();

        if payload is http:ClientError {
            log:printError("Error while parsing request payload (highlight_start_pomo_details)", 'error = payload);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        // Convert the payload to the HighlightPomoDetails record
        h_HighlightStopwatchStartDetailsTemp tempDetails = check payload.cloneWithType(h_HighlightStopwatchStartDetailsTemp);
        io:println("Received highlightStopwatchDetails:", tempDetails);

        // Convert start_time and end_time strings to time:Utc
        time:Utc|error startTime = time:utcFromString(tempDetails.start_time);

        if (startTime is error) {
            log:printError("Error parsing start_time or end_time", 'error = startTime);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }
        time:Utc adjustedStartTime = time:utcAddSeconds(startTime, +(5 * 3600 + 30 * 60));
        // Create HighlightPomoDetails record
        h_HighlightPomoStartDetails highlightDetails = {
            timer_id: tempDetails.timer_id,
            highlight_id: tempDetails.highlight_id,
            user_id: tempDetails.user_id,
            start_time: adjustedStartTime,
            status: tempDetails.status
        };

        string startTimeStr = time:utcToString(highlightDetails.start_time);
        string formattedStartTime = startTimeStr.substring(0, 10) + " " + startTimeStr.substring(11, 19);

        // Insert data into database
        sql:ExecutionResult|sql:Error result = database:Client->execute(`
            INSERT INTO Stopwatch (timerId, highlightId, userId, startTime,  status) 
            VALUES (${highlightDetails.timer_id}, ${highlightDetails.highlight_id}, ${highlightDetails.user_id}, ${formattedStartTime}, ${highlightDetails.status});
        `);

        if result is sql:Error {
            log:printError("Error while inserting data into HighlightPomoDetails", 'error = result);
            check caller->respond(http:STATUS_INTERNAL_SERVER_ERROR);
            return;
        }

        io:println("Started Data inserted successfully");
        check caller->respond(http:STATUS_OK);
    }

    resource function get active_stopwatch_highlight_details/[int userId]() returns h_ActiveStopwatchDetails[]|error {
        // SQL query to retrieve active (uncomplete) highlight timer details
        sql:ParameterizedQuery activeTimerQuery = `SELECT 
                                                hpd.id,
                                                hpd.highlightId
                                              FROM 
                                                Stopwatch hpd
                                              WHERE 
                                                hpd.userId = ${userId} 
                                                AND hpd.endTime IS NULL
                                                AND hpd.status = 'uncomplete'`;

        // Execute the query and retrieve the results
        stream<record {|
            int id;
            int highlightId;
        |}, sql:Error?> resultStream = database:Client->query(activeTimerQuery);

        h_ActiveStopwatchDetails[] activeStopwatchDetails = [];

        // Iterate over the results
        check from var detail in resultStream
            do {
                h_ActiveStopwatchDetails highlightDetail = {
                    stopwatch_id: detail.id,
                    highlight_id: detail.highlightId
                };

                activeStopwatchDetails.push(highlightDetail);
            };

        io:println("activeStopwatchDetails------------>>", activeStopwatchDetails);

        return activeStopwatchDetails;
    }

    resource function post end_stopwatch_details(http:Caller caller, http:Request req) returns error? {

        json|http:ClientError payload = req.getJsonPayload();

        if payload is http:ClientError {
            log:printError("Error while parsing request payload (pomo_details)", 'error = payload);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        h_HighlightStopwatchEndDetailsTemp tempDetails = check payload.cloneWithType(h_HighlightStopwatchEndDetailsTemp);

        time:Utc|error endTime = time:utcFromString(tempDetails.end_time);

        if (endTime is error) {
            log:printError("Error parsing end_time", 'error = endTime);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        time:Utc adjustedEndTime = time:utcAddSeconds(endTime, +(5 * 3600 + 30 * 60));

        h_HighlightStopwatchEndDetails highlightStopwatchDetails = {
            stopwatch_id: tempDetails.stopwatch_id,
            timer_id: tempDetails.timer_id,
            highlight_id: tempDetails.highlight_id,
            user_id: tempDetails.user_id,
            end_time: adjustedEndTime,
            status: tempDetails.status
        };

        string endTimeStr = time:utcToString(highlightStopwatchDetails.end_time);

        string formattedEndTime = endTimeStr.substring(0, 10) + " " + endTimeStr.substring(11, 19);

        sql:ExecutionResult|sql:Error result = database:Client->execute(`
            UPDATE PauseStopwatch 
            SET endTime = ${formattedEndTime}, status = ${highlightStopwatchDetails.status}
            WHERE id=${highlightStopwatchDetails.stopwatch_id} AND highlightId = ${highlightStopwatchDetails.highlight_id}  ;
        `);

        if result is sql:Error {
            log:printError("Error while inserting data into HighlightPomoDetails", 'error = result);
            check caller->respond(http:STATUS_INTERNAL_SERVER_ERROR);
            return;
        }

        // io:println("Data inserted successfully");
        check caller->respond(http:STATUS_OK);
    }

    resource function post pause_stopwatch_details(http:Caller caller, http:Request req) returns error? {

        json|http:ClientError payload = req.getJsonPayload();

        if payload is http:ClientError {
            log:printError("Error while parsing request payload (pause_stopwatch_details)", 'error = payload);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        // Convert the payload to the h_HighlightPomoDetailsTemp record
        h_stopwatch_PausesDetailsTemp tempDetails = check payload.cloneWithType(h_stopwatch_PausesDetailsTemp);
        // io:println("Received highlightPomoDetails:", tempDetails);

        // Convert pause_time string to time:Utc
        time:Utc|error pauseTime = time:utcFromString(tempDetails.pause_time);

        if (pauseTime is error) {
            log:printError("Error parsing pause_time", 'error = pauseTime);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        // Create a negative duration of 5 hours and 30 minutes
        time:Utc adjustedPauseTime = time:utcAddSeconds(pauseTime, +(5 * 3600 + 30 * 60));

        // Convert time:Utc to RFC 3339 string
        string adjustedPauseTimeStr = time:utcToString(adjustedPauseTime);

        // Manual formatting from RFC 3339 to "yyyy-MM-dd HH:mm:ss"
        string formattedPauseTime = adjustedPauseTimeStr.substring(0, 10) + " " + adjustedPauseTimeStr.substring(11, 19);

        // Create PausesDetails record with adjusted times
        h_stopwatch_PausesDetails pausesDetails = {
            stopwatch_id: tempDetails.stopwatch_id,
            highlight_id: tempDetails.highlight_id,
            pause_time: formattedPauseTime
        };

        // Insert data into database
        sql:ExecutionResult|sql:Error result = database:Client->execute(`
        INSERT INTO PauseStopwatch (highlightId, stopwatchId,  pauseTime) 
        VALUES (${pausesDetails.highlight_id}, ${pausesDetails.stopwatch_id}, ${pausesDetails.pause_time});
    `);

        if result is sql:Error {
            log:printError("Error while inserting data into HighlightPomoDetails", 'error = result);
            check caller->respond(http:STATUS_INTERNAL_SERVER_ERROR);
            return;
        }

        // io:println("Data inserted successfully");
        check caller->respond(http:STATUS_OK);
    }

    resource function post continue_stopwatch_details(http:Caller caller, http:Request req) returns error? {

        json|http:ClientError payload = req.getJsonPayload();

        if payload is http:ClientError {
            log:printError("Error while parsing request payload (continue_stopwatch_details)", 'error = payload);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }
        h_stopwatch_ContinueDetailsTemp tempDetails = check payload.cloneWithType(h_stopwatch_ContinueDetailsTemp);

        time:Utc|error continueTime = time:utcFromString(tempDetails.continue_time);

        if (continueTime is error) {
            log:printError("Error parsing pause_time", 'error = continueTime);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        time:Utc adjustedContinueTime = time:utcAddSeconds(continueTime, +(5 * 3600 + 30 * 60));

        string adjustedContinueTimeStr = time:utcToString(adjustedContinueTime);

        string formattedContinueTime = adjustedContinueTimeStr.substring(0, 10) + " " + adjustedContinueTimeStr.substring(11, 19);

        h_stopwatch_ContinueDetails continueDetails = {
            stopwatch_id: tempDetails.stopwatch_id,
            highlight_id: tempDetails.highlight_id,
            continue_time: formattedContinueTime
        };

        sql:ExecutionResult|sql:Error result = database:Client->execute(`
        UPDATE PauseStopwatch 
        SET continueTime = ${continueDetails.continue_time} 
        WHERE highlightId = ${continueDetails.highlight_id} AND  stopwatchId = ${continueDetails.stopwatch_id}
        AND continueTime IS NULL;
    `);

        if result is sql:Error {
            log:printError("Error while updating data into PausesDetails", 'error = result);
            check caller->respond(http:STATUS_INTERNAL_SERVER_ERROR);
            return;
        }

        check caller->respond(http:STATUS_OK);
    }
        resource function get stopwatch_focus_record/[int userId]() returns h_StopwatchTimeRecord[]|error {

        sql:ParameterizedQuery highlightQuery = `SELECT hpd.id,hpd.highlightId, hh.title, hpd.startTime, hpd.endTime 
                                             FROM Stopwatch hpd
                                             JOIN TaskList hh ON hpd.highlightId = hh.highlightId
                                             WHERE hpd.userId = ${userId} AND hpd.endTime IS NOT NULL`;
        stream<record {|int id; int highlightId; string title; time:Utc startTime; time:Utc endTime;|}, sql:Error?> highlightStream = database:Client->query(highlightQuery);

        h_StopwatchTimeRecord[] highlightTimeRecords = [];

        check from var highlight in highlightStream
            do {
                string[][] pauseAndContinueTimes = [];

                time:Utc newStartTime = time:utcAddSeconds(highlight.startTime, +(5 * 3600 + 30 * 60));
                time:Utc newEndTime = time:utcAddSeconds(highlight.endTime, +(5 * 3600 + 30 * 60));

                string startTimeStr = time:utcToString(newStartTime);
                string endTimeStr = time:utcToString(newEndTime);

                // Manual formatting from RFC 3339 to "yyyy-MM-dd HH:mm:ss"
                string formattedStartTime = startTimeStr.substring(0, 10) + " " + startTimeStr.substring(11, 19);
                string formattedEndTime = endTimeStr.substring(0, 10) + " " + endTimeStr.substring(11, 19);

                h_StopwatchTimeRecord timeRecord = {
                    stopwatch_id: highlight.id,
                    highlight_id: highlight.highlightId,
                    highlight_name: highlight.title,
                    start_time: formattedStartTime,
                    end_time: formattedEndTime,
                    pause_and_continue_times: pauseAndContinueTimes
                };

                highlightTimeRecords.push(timeRecord);
            };
        // io:println(highlightTimeRecords);
        return highlightTimeRecords;
    }
        resource function get stopwatch_pause_details/[int userId]() returns h_Stopwatch_PauseContinueDetails[]|error {
            
        sql:ParameterizedQuery sqlQuery = `SELECT 
                                        h.id,
                                        h.highlightId, 
                                        p.pauseTime, 
                                        p.continueTime 
                                      FROM 
                                        Stopwatch h 
                                      JOIN 
                                        PauseStopwatch p 
                                      ON 
                                        h.id = p.stopwatchId 
                                      WHERE 
                                        h.user_id = ${userId}`;


        stream<record {|
            int id;
            int highlightId;
            time:Utc pauseTime;
            time:Utc? continueTime;
        |}, sql:Error?> resultStream = database:Client->query(sqlQuery);

        h_Stopwatch_PauseContinueDetails[] pauseContinueDetails = [];


        check from var pauseDetail in resultStream
            do {
                
                time:Utc newPauseTime = time:utcAddSeconds(pauseDetail.pauseTime, +(5 * 3600 + 30 * 60));
                time:Utc? newContinueTime = pauseDetail.continueTime != () ? time:utcAddSeconds(<time:Utc>pauseDetail.continueTime, +(5 * 3600 + 30 * 60)) : ();


                string pauseTimeStr = time:utcToString(newPauseTime);
                string? continueTimeStr = newContinueTime != () ? time:utcToString(newContinueTime) : ();

                // Manual formatting from RFC 3339 to "yyyy-MM-dd HH:mm:ss"
                string formattedPauseTime = pauseTimeStr.substring(0, 10) + " " + pauseTimeStr.substring(11, 19);
                string? formattedContinueTime = continueTimeStr != () ? continueTimeStr.substring(0, 10) + " " + continueTimeStr.substring(11, 19) : ();

                h_Stopwatch_PauseContinueDetails pauseContinueDetail = {
                    stopwatch_id: pauseDetail.id,
                    highlight_id: pauseDetail.highlightId,
                    pause_time: formattedPauseTime,
                    continue_time: formattedContinueTime
                };

                pauseContinueDetails.push(pauseContinueDetail);
            };

        io:println(pauseContinueDetails);

        return pauseContinueDetails;
    }

    resource function post predict(http:Caller caller, http:Request req) returns error? {

        json payload = check req.getJsonPayload();
        log:printInfo("Received payload: " + payload.toString());

        // Call the Python API to get the estimated time
        var response = callPythonPredictAPI(payload);
        json responseJson;
        if (response is json) {
            responseJson = response;
        } else {
            responseJson = {"error": response.toString()};
        }

        // Send the response
        check caller->respond(responseJson);
    }

    resource function post review/[int id](http:Caller caller, http:Request req) returns error? {
        // Extract the description from the request payload
        json payload = check req.getJsonPayload();

        // Check if the description field exists and is of type string
        string? description = (check payload.description).toString();

        if (description is string) {
            // Execute the SQL query using the SQL client
            sql:ExecutionResult|sql:Error result = database:Client->execute(
            `INSERT INTO review (id, description) VALUES (${id}, ${description})`
            );

            // Check the result and handle errors if necessary
            if (result is sql:Error) {
                log:printError("Error while inserting data into the review table", 'error = result);
                // Respond with an error and status code
                check caller->respond({
                    "error": "Internal Server Error: Failed to insert review"
                });
                return;
            }

            // Return success if there are no errors
            log:printInfo("Data inserted successfully for review ID: " + id.toString());
            // Respond with a success message and status code
            check caller->respond({
                "message": "Review inserted successfully"
            });
        } else {
            // Handle the case where the description is missing or not a string
            log:printError("Invalid description field in the request payload");
            // Respond with a bad request error and status code
            check caller->respond({
                "error": "Bad Request: Missing or invalid 'description' field"
            });
        }
    }

    resource function get time() returns Task[]|error {
        sql:ParameterizedQuery query = `SELECT  dueDate, startTime, endTime FROM hi`;
        stream<Task, sql:Error?> resultStream = database:Client->query(query);
        Task[] tasksList = [];
        error? e = resultStream.forEach(function(Task task) {
            tasksList.push(task);
        });
        if (e is error) {
            log:printError("Error occurred while fetching tasks: ", 'error = e);
            return e;
        }
        // io:print(tasklist);
        // io:println(tasksList);
        return tasksList;
    }

    resource function patch completed/[int taskId]/status(@http:Payload Task status) returns error? {
        io:println("Updating task status");

        // Check if the status object and taskId are valid before executing SQL
        if status.status is string && taskId is int {
            // sql:ExecutionResult|sql:Error result = database:Client->execute(`

            sql:ExecutionResult|sql:Error result = database:Client->execute(`
            UPDATE hi SET status = ${status.status} WHERE id = ${taskId}
        `);

            if result is sql:Error {
                log:printError("Error occurred while updating task status", result);
                return error("Failed to update status for task: " + taskId.toString());
            } else {
                if result.affectedRowCount > 0 {
                    return;
                } else {
                    return error("No task found with id: " + taskId.toString());
                }
            }
        }
    }

}

function callPythonPredictAPI(json payload) returns json|error {
    io:print("tes1");
    io:println(payload);
    io:print("test2");

    // Create an HTTP client instance
    http:Client clientEP = check new ("http://localhost:8081");

    // Create a new HTTP request
    http:Request req = new;
    req.setPayload(payload);
    req.setHeader("Content-Type", "application/json");

    // Send a POST request to the Python API
    http:Response response = check clientEP->post("/predict", req);

    // Process the response
    if (response.statusCode == 200) {
        var jsonResponse = response.getJsonPayload();
        if (jsonResponse is json) {
            return jsonResponse;
        } else {
            return {"error": "Invalid JSON response from Python API"};
        }
    } else {
        // return { "error": "Error from Python API: " + response.statusCode().toString() };

    }

}

function formatDateTime(string isodueDateTime) returns string {
    time:Utc utc = checkpanic time:utcFromString(isodueDateTime);
    time:Civil dt = time:utcToCivil(utc);
    return string `${dt.year}-${dt.month}-${dt.day}`;
}

function formatTime(string isoTime) returns string {
    
    string fullTime = "1970-01-01T" + (isoTime.length() == 5 ? isoTime + ":00Z" : isoTime + "Z");


    time:Utc|time:Error utc = time:utcFromString(fullTime);
    if (utc is error) {
        log:printError("Error parsing time string:", utc);
        return "";
    }


    time:Civil dt = time:utcToCivil(<time:Utc>utc);

    return string `${dt.hour}:${dt.minute}:${dt.second ?: 0}`;
}
