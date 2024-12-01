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
// import ballerina/lang.'string as strings;
import ballerina/lang.runtime;
import ballerina/log;
import ballerina/sql;
import ballerinax/mysql.driver as _;

type review record {|
    string id;
    string description;
|};

type task record {|
    int projectId;
    string taskName;
    string progress;
    string priority;
    string startDate;
    string dueDate;
    int taskId;
    int percentage;
    // string [] assignee;
|};

type AssigneeRow record {|
    string assignee;
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
service / on http_listener:Listener {

    // resource function post addTask(http:Caller caller, http:Request req) returns error? {
    //     json payload = check req.getJsonPayload();

    //     string taskName = (check payload.taskName).toString();
    //     string progress = (check payload.progress).toString();
    //     string priority = (check payload.priority).toString();
    //     // json assignees = check payload.assignees;
    //     // string assigneesJson = assignees.toString();
    //     string startDate = (check payload.startDate).toString();
    //     string dueDate = (check payload.dueDate).toString();
    //     int projectId = (check payload.projectId);
    //     int percentage = (check payload.percentage);

    //     sql:ParameterizedQuery insertQuery = `INSERT INTO taskss (taskName,progress, priority, startDate, dueDate,projectId,percentage) VALUES (${taskName},${progress}, ${priority}, ${startDate}, ${dueDate},${projectId},${percentage})`;
    //     _ = check database:Client->execute(insertQuery);

    //     sql:ParameterizedQuery selectQuery = `SELECT taskName,progress, priority,  startDate, dueDate,percentage,taskId FROM taskss`;
    //     stream<record {|anydata...;|}, sql:Error?> resultStream = database:Client->query(selectQuery);

    //     json[] resultJsonArray = [];
    //     check from record {|anydata...;|} row in resultStream
    //         do {
    //             resultJsonArray.push(row.toJson());
    //         };

    //     json response = {projects: resultJsonArray};
    //     http:Response res = new;
    //     res.setPayload(response);
    //     // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    //     check caller->respond(res);

    //     return;
    // }

    // resource function post addProjects(http:Caller caller, http:Request req) returns error? {
    //     io:print("this inside add project");
    //     json payload = check req.getJsonPayload();

    //     string projectName = (check payload.projectName).toString();
    //     string progress = (check payload.progress).toString();
    //     string priority = (check payload.priority).toString();
    //     // json assignees = check payload.assignees;
    //     // string assigneesJson = assignees.toString();
    //     string startDate = (check payload.startDate).toString();
    //     string dueDate = (check payload.dueDate).toString();
    //     int percentage = (check payload.percentage);

    //     sql:ParameterizedQuery insertQuery = `INSERT INTO projects (projectName,progress, priority, startDate, dueDate,percentage) VALUES (${projectName},${progress}, ${priority}, ${startDate}, ${dueDate},${percentage})`;
    //     _ = check database:Client->execute(insertQuery);

    //     sql:ParameterizedQuery selectQuery = `SELECT id,projectName,progress, priority,  startDate, dueDate,percentage FROM projects`;
    //     stream<record {|anydata...;|}, sql:Error?> resultStream = database:Client->query(selectQuery);

    //     json[] resultJsonArray = [];
    //     check from record {|anydata...;|} row in resultStream
    //         do {
    //             resultJsonArray.push(row.toJson());
    //         };

    //     json response = {projects: resultJsonArray};
    //     http:Response res = new;
    //     res.setPayload(response);
    //     // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    //     check caller->respond(res);

    //     return;
    // }

    
    // resource function get projects(http:Caller caller, http:Request req) returns error? {

    //     sql:ParameterizedQuery selectQuery = `SELECT id,projectName,progress, priority,  startDate, dueDate,percentage FROM projects`;
    //     stream<record {|anydata...;|}, sql:Error?> resultStream = database:Client->query(selectQuery);

    //     json[] resultJsonArray = [];
    //     check from record {|anydata...;|} row in resultStream
    //         do {
    //             resultJsonArray.push(row.toJson());
    //         };
    //     io:println("totl projects", resultJsonArray);

    //     json response = {projects: resultJsonArray};
    //     http:Response res = new;
    //     res.setPayload(response);
   
    //     check caller->respond(res);

    //     return;
    // }

 
    // resource function put updateProject(http:Caller caller, http:Request req) returns error? {
    //     json payload = check req.getJsonPayload();

    //     int projectId = check payload.id;
    //     string projectName = (check payload.projectName).toString();
    //     string progress = (check payload.progress).toString();
    //     string priority = (check payload.priority).toString();
     
    //     int? indexOfT = strings:indexOf(check payload.startDate, "T");

    //     // Extract the date part (before 'T')
    //     string startDate = strings:substring(check payload.startDate, 0, <int>indexOfT);

    //     int? indexOfT2 = strings:indexOf(check payload.dueDate, "T");

    //     // Extract the date part (before 'T')
    //     string dueDate = strings:substring(check payload.dueDate, 0, <int>indexOfT2);

    //     io:println("Formatted Due Date: ", payload.startDate);
        
    //     sql:ParameterizedQuery updateQuery = `UPDATE projects SET projectName = ${projectName}, progress = ${progress}, priority = ${priority},startDate=${startDate},dueDate=${dueDate}   WHERE id = ${projectId}`;
    //     _ = check database:Client->execute(updateQuery);

    //     json response = {message: "Project updated successfully"};
    //     http:Response res = new;
    //     res.setPayload(response);
       
    //     check caller->respond(res);

    //     return;
    // }

    // //  resource function to get details of a specific project based on project id
    // resource function get project/[int projectId](http:Caller caller, http:Request req) returns error? {
    //     // Prepare the SQL query to select project details by ID
    //     sql:ParameterizedQuery selectQuery = `SELECT id, projectName, progress, priority, startDate, dueDate FROM projects WHERE id = ${projectId}`;

    //     // Execute the query and get the result stream
    //     stream<record {|anydata...;|}, sql:Error?> resultStream = database:Client->query(selectQuery);

    //     // Variables to hold project details and response
    //     record {|anydata...;|}? projectDetails;
    //     json response;

    //     // Iterate through the result stream

    //     projectDetails = check resultStream.next();
     
    //     response = projectDetails.toJson();

    //     io:println(resultStream);
    //     io:println(response);
    //     io:println(projectId);
    //     io:println(projectDetails);

    //     // Create and set HTTP response
    //     http:Response res = new;
    //     res.setPayload(response);

    //     check caller->respond(res);

    //     return;
    // }

    // resource function put updateTask(http:Caller caller, http:Request req) returns error? {
    //     json payload = check req.getJsonPayload();

    //     int projectId = <int>check payload.projectId;
    //     int taskId = <int>check payload.taskId;
    //     int percentage = <int>check payload.percentage;
    //     string taskName = (check payload.taskName).toString();
    //     string progress = (check payload.progress).toString();
    //     string priority = (check payload.priority).toString();
    //     json [] assignees = <json[]>(check payload.assignees);
    //     io:println("my new assignees: ", payload.assignees,taskId);

    //     int? indexOfT = strings:indexOf(check payload.startDate, "T");

    //     // Extract the date part (before 'T')
    //     string startDate = strings:substring(check payload.startDate, 0, <int>indexOfT);

    //     int? indexOfT2 = strings:indexOf(check payload.dueDate, "T");

    //     // Extract the date part (before 'T')
    //     string dueDate = strings:substring(check payload.dueDate, 0, <int>indexOfT2);

    //     io:println("Formatted Due Date: ", payload.startDate);

    //     sql:ParameterizedQuery updateQuery = `UPDATE taskss SET taskName = ${taskName}, progress = ${progress}, priority = ${priority},startDate=${startDate},dueDate=${dueDate},percentage=${percentage}   WHERE taskId = ${taskId} AND projectId=${projectId}`;
    //     _ = check database:Client->execute(updateQuery);
        
    //     foreach json assi  in assignees{
    //      sql:ParameterizedQuery insertQuery = `INSERT INTO assignees (taskId,assignee) VALUES (${taskId},${assi.toString()})`;
    //     _ = check database:Client->execute(insertQuery);
    //     }

    //     json response = {message: "Task updated successfully"};
    //     http:Response res = new;
    //     res.setPayload(response);
    //     // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    //     check caller->respond(res);

    //     return;
    // }

    // resource function get tasks/[int projectId](http:Caller caller, http:Request req) returns error? {

    //     sql:ParameterizedQuery selectQuery = `SELECT projectId,taskName,progress, priority,  startDate, dueDate,percentage,taskId FROM taskss WHERE projectId=${projectId}`;
    //     stream<task, sql:Error?> resultStream = database:Client->query(selectQuery);

    //     json[] resultJsonArray = [];
    //     check from task row in resultStream
    //         do {
    //             string[] myarr = [];
    //             // io:println("task id",row.taskId);
    //             sql:ParameterizedQuery selectQuery2 = `SELECT assignee FROM assignees WHERE taskId=${row.taskId}`;
    //             stream<AssigneeRow, sql:Error?> resultStream2 = database:Client->query(selectQuery2);
    //             // io:println("result stream2",resultStream2);

    //             // json[] assigneesArray = [];
    //             // map<string []> ass={};
    //             // ass["assignee"]=[];
    //             json[] aiyo = [];
    //             // aiyo.push("hooo");
               
                            
    //             // Iterate over each AssigneeRow in the assignees stream
    //             check from AssigneeRow assigneeRow in resultStream2
    //             do {
    //             //    assigneesArray.push(assigneeRow.assignee.toJson());
    //             // hu.push(assigneeRow.assignee.toString());
    //             // myarr.push("heloo");
    //             // aiyo.push(assigneeRow.toJson());
                
    //             io:println("mage assignee row eka",assigneeRow);
    //             };
    //             // fulltask finalrow={projectId:0 ,taskName:"" ,progress: "",priority: "",startDate: "",dueDate: {year: 0, month: 0, day: 0},taskId: 0,percentage: 0,assignee: []};
    //             // finalrow.projectId=row.projectId;
    //             // finalrow.taskName=row.taskName;
    //             // finalrow.progress=row.progress;
    //             // finalrow.priority=row.priority;
    //             // finalrow.startDate=row.startDate;
    //             // finalrow.dueDate=row.dueDate;
    //             // finalrow.taskId=row.taskId;
    //             // finalrow.percentage=row.percentage;
    //             // finalrow.assignee=hu;
    //             // ass["assignee"]=hu;
    //             // row["assignee"]=hu;

    //             //  string[] taskJson = row.toArray();
    //             // taskJson['assignee']=
    //             // io:println("mage row eka",row);
                
    //            // taskJson.push(assigneesArray);

    //             // Add the enriched task JSON to the result array
    //             // resultJsonArray.push(taskJson);

    //             resultJsonArray.push(row.toJson());
    //         };
    //     io:println("totl projects", resultJsonArray);

    //     json response = {projects: resultJsonArray};
    //     http:Response res = new;
    //     res.setPayload(response);
    //     // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    //     check caller->respond(res);

    //     return;
    // }


    // resource function delete tasks/[int taskId](http:Caller caller) returns error? {
    //     io:println("xdd");
    //     sql:ExecutionResult|sql:Error result = database:Client->execute(`
    //         DELETE FROM hi WHERE id = ${taskId};
    //     `);

    //     if result is sql:Error {
    //         log:printError("Error occurred while deleting task", result);
    //         check caller->respond(http:STATUS_INTERNAL_SERVER_ERROR);
    //     } else {
    //         check caller->respond(http:STATUS_OK);
    //     }
    // }

    
    
    //     resource function get assignedTasks(http:Caller caller, http:Request req) returns error? {

    //     sql:ParameterizedQuery selectQuery = `SELECT t.taskId,t.taskName,t.progress,t.priority,t.startDate,t.dueDate,t.percentage,p.projectName,p.id FROM taskss t JOIN assignees a ON a.taskId=t.taskId JOIN projects p ON t.projectId=p.id WHERE a.assignee="jaga@gmail.com"`;
    //     stream<record {|anydata...;|}, sql:Error?> resultStream = database:Client->query(selectQuery);

    //     json[] resultJsonArray = [];
    //     check from record {|anydata...;|} row in resultStream
    //         do {
                
    //             io:println("task id",row);
                

    //             // json[] assigneesArray = [];
            
    //             // Iterate over each AssigneeRow in the assignees stream
    //             // check from AssigneeRow assigneeRow in resultStream2
    //             // do {
    //             //    assigneesArray.push(assigneeRow.assignee.toJson());
    //             // };

    //             // json taskJson = row.toJson();
    //             // io:println("taskjson",taskJson);
                
    //            // taskJson.push(assigneesArray);

    //             // Add the enriched task JSON to the result array
    //             // resultJsonArray.push(taskJson);

    //             resultJsonArray.push(row.toJson());
    //         };
    //     io:println("totl projects", resultJsonArray);

    //     json response = {projects: resultJsonArray};
    //     http:Response res = new;
    //     res.setPayload(response);
    //     // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    //     check caller->respond(res);

    //     return;
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

    // sql:ParameterizedQuery query = `UPDATE Task SET status = 'Overdue' WHERE status = 'pending' AND endTime < CONVERT_TZ(NOW(), '+00:00', '+05:30')`;

    // sql:ExecutionResult result = check database:Client->execute(query);

    // int? affectedRowCount = result.affectedRowCount;
    // log:printInfo(string `Updated ${affectedRowCount ?: 0} overdue tasks successfully.`);
}

// public function main() returns error? {
//     io:println("Starting the service...");

//     _ = start scheduleTask();
// }
