import webapp.backend.calendar as _;
import webapp.backend.database;
import webapp.backend.focus as _;
import webapp.backend.highlights as _;
import webapp.backend.analatics as _;
import webapp.backend.http_listener;
import webapp.backend.issues as _;
import webapp.backend.lists as _;
import webapp.backend.projects as _;
import webapp.backend.tips as _;
import webapp.backend.users as _;

import ballerina/http;
import ballerina/io;
import ballerina/lang.'string as strings;
// import ballerina/lang.runtime;
import ballerina/log;
import ballerina/sql;
// import ballerina/time;5
import ballerinax/mysql.driver as _;
import ballerina/lang.runtime;


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

type review record {|
    string id;
    string description;
|};

configurable string azureAdIssuer = ?;
configurable string azureAdAudience = ?;
configurable string[] corsAllowOrigins = ?;

type PauseAndContinueTime record {

};



type Feedback record {
    
};

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
service / on http_listener:Listener {

   



    

   

 

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

    resource function post review/[int id](http:Caller caller, http:Request req) returns error? {
        json payload = check req.getJsonPayload();

        string? description = (check payload.description).toString();
        io:println(id);
        if (description is string) {
            sql:ExecutionResult|sql:Error result = database:Client->execute(
            `INSERT INTO Review (id, description) VALUES (${id}, ${description})`
            );

            if (result is sql:Error) {
                log:printError("Error while inserting data into the review table", 'error = result);
                check caller->respond({
                    "error": "Internal Server Error: Failed to insert review"
                });
                return;
            }

            log:printInfo("Data inserted successfully for review ID: " + id.toString());
            check caller->respond({
                "message": "Review inserted successfully"
            });
        } else {
            log:printError("Invalid description field in the request payload");
            check caller->respond({
                "error": "Bad Request: Missing or invalid 'description' field"
            });
        }
    }


}


   function scheduleTask() {
    while (true) {

        error? result = updateOverdueTasks();
        if (result is error) {
            log:printError("Error updating overdue tasks", result);
        }

        runtime:sleep(1 * 5);

    }
}

function updateOverdueTasks() returns error? {

    sql:ParameterizedQuery query = `UPDATE Task SET status = 'Overdue' WHERE status = 'pending' AND endTime < CONVERT_TZ(NOW(), '+00:00', '+05:30')`;

    sql:ExecutionResult result = check database:Client->execute(query);

    int? affectedRowCount = result.affectedRowCount;
    // log:printInfo(string `Updated ${affectedRowCount ?: 0} overdue tasks successfully.`);
}


    public function main() returns error? {
    io:println("Starting the service...");

    _ = start scheduleTask();
    check http_listener:Listener.start();
}