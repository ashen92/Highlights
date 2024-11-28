import webapp.backend.database;
import webapp.backend.http_listener;

import ballerina/http;
import ballerina/io;
// import ballerina/lang.runtime;
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
    string? completionTime;
    int userId;
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
    int userId;
    string? completionTime = ();

|};

type Feedback record {|
    int tipId;
    boolean isUseful;
|};

configurable string azureAdIssuer = ?;
configurable string azureAdAudience = ?;
configurable string[] corsAllowOrigins = ?;

configurable string predictionServiceURL = ?;

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
        allowHeaders: [
            "Content-Type",
            "Authorization",
            "X-Requested-With",
            "X-Forwarded-For",
            "X-Forwarded-Proto",
            "X-Forwarded-Host"
        ],
        maxAge: 84900
    }
}
service /highlights on http_listener:Listener {

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

    resource function get tasks(int userId) returns Task[]|error {
        return self.fetchTasksForToday(userId);
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
        string dueDate = task.dueDate != () ? formatDateTime(task.dueDate.toString()) + " 00:00:00" : "";
        string startTime = task.startTime != () ? formatDateTimeWithTime(task.dueDate.toString(), task.startTime.toString()) : "";
        string endTime = task.endTime != () ? formatDateTimeWithTime(task.dueDate.toString(), task.endTime.toString()) : "";

        sql:ExecutionResult|sql:Error result = database:Client->execute(`
        INSERT INTO Task (title, dueDate, startTime, endTime, label, reminder, priority, description, userId, status, completionTime) 
        VALUES (${task.title}, ${dueDate}, ${startTime}, ${endTime}, ${task.label} ,${task.reminder}, ${task.priority}, ${task.description}, ${task.userId}, 'pending', NULL);
    `);

        if result is sql:Error {
            log:printError("Error occurred while inserting task", 'error = result);
            check caller->respond(http:STATUS_INTERNAL_SERVER_ERROR);
        }

        Task[]|error tasks = self.fetchTasksForToday(task.userId);
        if (tasks is error) {
            log:printError("Error occurred while fetching tasks: ", 'error = tasks);
            check caller->respond(http:STATUS_INTERNAL_SERVER_ERROR);
            return;
        }

        // io:println(tasks);

        check caller->respond(tasks);

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
        string dueDate = task.dueDate != () ? formatDateTime(task.dueDate.toString()) + " 00:00:00" : "";
        string startTime = task.startTime != () ? formatDateTimeWithTime(task.dueDate.toString(), task.startTime.toString()) : "";
        string endTime = task.endTime != () ? formatDateTimeWithTime(task.dueDate.toString(), task.endTime.toString()) : "";

        sql:ExecutionResult|sql:Error result = database:Client->execute(`
        UPDATE Task SET title = ${task.title}, 
                      dueDate = ${dueDate}, 
                      startTime = ${startTime}, 
                      endTime = ${endTime}, 
                      reminder = ${task.reminder}, 
                      priority = ${task.priority},
                      status = 'pending',
                      description = ${task.description},
                      completionTime = NULL

        WHERE id = ${taskId};
    `);

        if result is sql:Error {
            log:printError("Error occurred while updating task", 'error = result);
            check caller->respond(http:STATUS_INTERNAL_SERVER_ERROR);
        } else {
            check caller->respond(http:STATUS_OK);
        }
    }

    resource function delete tasks/[int taskId](http:Caller caller) returns error? {
        io:println("xdd");
        sql:ExecutionResult|sql:Error result = database:Client->execute(`
            DELETE FROM Task WHERE id = ${taskId};
        `);

        if result is sql:Error {
            log:printError("Error occurred while deleting task", result);
            check caller->respond(http:STATUS_INTERNAL_SERVER_ERROR);
        } else {
            check caller->respond(http:STATUS_OK);
        }
    }

    resource function post predict(http:Caller caller, http:Request req) returns error? {
        io:println("xxx");
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


    
  resource function get time(int userId, string dueDate) returns Task[]|error {
    io:println("Received dueDate: " + dueDate);

    sql:ParameterizedQuery query = `SELECT dueDate, startTime, endTime 
                                    FROM Task 
                                    WHERE userId = ${userId} 
                                    AND status = 'pending' 
                                    AND DATE(dueDate) = DATE_ADD(${dueDate}, INTERVAL 1 DAY)`;

    stream<Task, sql:Error?> resultStream = database:Client->query(query);

    Task[] tasksList = [];

    error? e = resultStream.forEach(function(Task task) {
        tasksList.push(task);
    });

    if (e is error) {
        log:printError("Error occurred while fetching tasks: ", 'error = e);
        return e;
    }

    return tasksList;
}



    
    resource function put completed/[int taskId](http:Caller caller, http:Request req) returns error? {

        sql:ExecutionResult|sql:Error result = database:Client->execute(`
        UPDATE Task SET status = 'completed', completionTime = CONVERT_TZ(CURRENT_TIMESTAMP, '+00:00', '+05:30') WHERE id = ${taskId}
    `);

        if result is sql:Error {
            check caller->respond("Task status updated to completed unsccessfully");
            return result;
        }

        check caller->respond("Task status updated to completed successfully");
    }

     resource function get time1(int userId) returns Task[]|error {
        
        sql:ParameterizedQuery query = `SELECT  dueDate, startTime, endTime FROM Task WHERE userId=${userId}`;
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

function formatDateTimeWithTime(string dueDate, string time) returns string {
    string datePart = formatDateTime(dueDate);
    string timePart = formatTime(time);

    // Combine into `YYYY-MM-DD HH:MM:SS` format
    return datePart + " " + timePart;
}

function callPythonPredictAPI(json payload) returns json|error {

    // Create an HTTP client instance
    http:Client clientEP = check new (predictionServiceURL);

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
