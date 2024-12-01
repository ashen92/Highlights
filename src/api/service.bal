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
}
