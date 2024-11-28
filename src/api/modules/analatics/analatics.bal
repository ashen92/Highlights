import webapp.backend.http_listener;
import ballerina/http;
import ballerina/log;
import ballerina/sql;
import ballerinax/mysql.driver as _;
import webapp.backend.database;
import ballerina/io;

import ballerina/time;


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
    string? completionTime;
    int userId;
};

type TaskCount record {|
    int count;
|};

type FocusTimeRecord record {| 
    decimal focusTime; 
    int month; 
    int year; 
|};



configurable string azureAdIssuer = ?;
configurable string azureAdAudience = ?;
configurable string[] corsAllowOrigins = ?;

@http:ServiceConfig {
    auth: [
        {
            jwtValidatorConfig: {
                issuer: azureAdIssuer,
                audience: azureAdAudience,
                scopeKey: "scp"
            },
            scopes: ["User.Read"]
        }
    ],
    cors: {
        allowOrigins: corsAllowOrigins,
        allowCredentials: false,
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
        maxAge: 84900
    }
}
service /analatics on http_listener:Listener {


      private function fetchTasksForToday(int userId) returns Task[]|error {
 sql:ParameterizedQuery query = `SELECT id, title, 
                                      CONVERT_TZ(dueDate, '+00:00', '+05:30') AS dueDate,
                                      startTime, endTime, label, reminder, priority, description, status
                               FROM Task
                               WHERE DATE(CONVERT_TZ(dueDate, '+00:00', '+05:30')) = DATE(CONVERT_TZ(CURRENT_TIMESTAMP, '+00:00', '+05:30'))
                                 AND userId = ${userId}`;

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
    resource function get fetchHighlightsCompletion(int userId) returns Task[]|error {
        io:println("Sss");
        return self.fetchTasksForToday(userId);
    }

    resource function get antasks(int userId) returns json|error {
        io:println("s22");
    // Define query for current month task count
    sql:ParameterizedQuery currentMonthQuery = `
        SELECT COUNT(*) AS count
        FROM Task
        WHERE userId = ${userId}
          AND MONTH(CONVERT_TZ(dueDate, '+00:00', '+05:30')) = MONTH(CONVERT_TZ(CURRENT_TIMESTAMP, '+00:00', '+05:30'))
          AND YEAR(CONVERT_TZ(dueDate, '+00:00', '+05:30')) = YEAR(CONVERT_TZ(CURRENT_TIMESTAMP, '+00:00', '+05:30'))
    `;

    // Define query for previous month task count
    sql:ParameterizedQuery previousMonthQuery = `
        SELECT COUNT(*) AS count
        FROM Task
        WHERE userId = ${userId}
          AND MONTH(CONVERT_TZ(dueDate, '+00:00', '+05:30')) = MONTH(CONVERT_TZ(CURRENT_TIMESTAMP, '+00:00', '+05:30')) - 1
          AND YEAR(CONVERT_TZ(dueDate, '+00:00', '+05:30')) = YEAR(CONVERT_TZ(CURRENT_TIMESTAMP, '+00:00', '+05:30'))
    `;

    // Execute queries and map results to the TaskCount record
    TaskCount|sql:Error currentMonthCountResult = database:Client->queryRow(currentMonthQuery, TaskCount);
    TaskCount|sql:Error previousMonthCountResult = database:Client->queryRow(previousMonthQuery, TaskCount);

    if (currentMonthCountResult is sql:Error || previousMonthCountResult is sql:Error) {
        return error("Failed to retrieve task counts");
    }

    // Extract counts from the records
    int currentMonthCount = currentMonthCountResult.count;
    int previousMonthCount = previousMonthCountResult.count;

    return {
        "currentMonthCount": currentMonthCount,
        "previousMonthCount": previousMonthCount
    };
}














// 





  function   getFocusRecord(int userId) returns json[]|error {
        sql:ParameterizedQuery highlightQuery = `
            SELECT 
                SUM(TIMESTAMPDIFF(SECOND, startTime, endTime)) AS focusTime,
                MONTH(startTime) AS month,
                YEAR(startTime) AS year
            FROM Pomodoro
            WHERE userId = ${userId} AND endTime IS NOT NULL
            GROUP BY YEAR(startTime), MONTH(startTime)
            ORDER BY year DESC, month DESC
        `;

        stream<record {| decimal focusTime; int month; int year; |}, sql:Error?> focusTimeStream = 
            database:Client->query(highlightQuery);

        json[] focusData = [];
        error? e = focusTimeStream.forEach(function(record {| decimal focusTime; int month; int year; |} rec) {
            json monthFocus = {
                "focusTime": rec.focusTime,
                "month": rec.month,
                "year": rec.year
            };
            focusData.push(monthFocus);
        });

        if (e is error) {
            log:printError("Error while processing focus data: ", 'error = e);
            return e;
        }

        check focusTimeStream.close();
        return focusData;
    }

      function  getStopwatchFocusRecord(int userId) returns json[]|error {
        sql:ParameterizedQuery stopwatchQuery = `
            SELECT 
                SUM(TIMESTAMPDIFF(SECOND, startTime, endTime)) AS focusTime,
                MONTH(startTime) AS month,
                YEAR(startTime) AS year
            FROM Stopwatch
            WHERE userId = ${userId} AND endTime IS NOT NULL
            GROUP BY YEAR(startTime), MONTH(startTime)
            ORDER BY year DESC, month DESC
        `;

        stream<record {| decimal focusTime; int month; int year; |}, sql:Error?> focusTimeStream = 
            database:Client->query(stopwatchQuery);

        json[] focusData = [];
        error? e = focusTimeStream.forEach(function(record {| decimal focusTime; int month; int year; |} rec) {
            json monthFocus = {
                "focusTime": rec.focusTime,
                "month": rec.month,
                "year": rec.year
            };
            focusData.push(monthFocus);
        });

        if (e is error) {
            log:printError("Error while processing stopwatch focus data: ", 'error = e);
            return e;
        }

        check focusTimeStream.close();
        return focusData;
    }







resource function get getFullFocusTime(int userId) returns json|error {
    // Get the current date and calculate current and previous months
    time:Utc utcNow = time:utcNow();
    time:Civil currentDate = time:utcToCivil(utcNow);
    int currentYear = currentDate.year;
    int currentMonth = currentDate.month;

    // Calculate previous month and handle year rollover
    int previousMonth = currentMonth - 1;
    int previousYear = currentYear;

    if (previousMonth == 0) {
        previousMonth = 12;
        previousYear -= 1;
    }

    // Fetch focus data from Pomodoro and Stopwatch tables
    json[]|error focusDataResult = self.getFocusRecord(userId);
    json[]|error stopwatchDataResult = self.getStopwatchFocusRecord(userId);

    if (focusDataResult is error) {
        return error("Error fetching focus data: " + focusDataResult.message());
    }

    if (stopwatchDataResult is error) {
        return error("Error fetching stopwatch data: " + stopwatchDataResult.message());
    }
json[] combinedData = [];

// Append focusDataResult to combinedData
if (focusDataResult is json[]) {
    foreach json item in focusDataResult {
        combinedData.push(item);
    }
}

// Append stopwatchDataResult to combinedData
if (stopwatchDataResult is json[]) {
    foreach json item in stopwatchDataResult {
        combinedData.push(item);
    }
}


    // Initialize totals
    decimal currentMonthFocus = 0;
    decimal previousMonthFocus = 0;

    // Calculate totals for current and previous months
    foreach json item in combinedData {
        if item is map<anydata> {
        int recordMonth = check item["month"].ensureType(int);
        int recordYear = check item["year"].ensureType(int);
        decimal recordFocusTime = check item["focusTime"].ensureType(decimal);

        if (recordYear == currentYear && recordMonth == currentMonth) {
            currentMonthFocus += recordFocusTime;
        } else if (recordYear == previousYear && recordMonth == previousMonth) {
            previousMonthFocus += recordFocusTime;
        }
    }

    }

    // Return the result
    json result = {
        "currentMonthFocus": currentMonthFocus,
        "previousMonthFocus": previousMonthFocus
    };
    return result;
}




resource function get getproject(int userId) returns json|error {
    io:println("Fetching project tasks for userId: " + userId.toString());
    
    sql:ParameterizedQuery query = `
        SELECT p.projectName, t.taskName, t.percentage
        FROM Projects1 p
        INNER JOIN taskss1 t ON p.id = t.projectId
        INNER JOIN assignees a ON t.taskId = a.taskId
        WHERE a.userId = ${userId}`;

    // Stream results for processing
    stream<record {| string projectName; string taskName; int percentage; |}, sql:Error?> resultStream = database:Client->query(query);

    // Array to hold task details
    json[] taskDetails = [];
    error? e = resultStream.forEach(function(record {| string projectName; string taskName; int percentage; |} row) {
        json task = {
            "projectName": row.projectName,
            "taskName": row.taskName,
            "percentage": row.percentage
        };
        taskDetails.push(task);
    });

    if (e is error) {
        log:printError("Error occurred while processing task results: ", 'error = e);
        return e;
    }

    // Close the result stream
    check resultStream.close();

    // Return tasks as a JSON array
    return taskDetails;
}






 






}

