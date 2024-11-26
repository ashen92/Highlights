import webapp.backend.http_listener;
import ballerina/http;
import ballerina/log;
import ballerina/sql;
import ballerinax/mysql.driver as _;
import webapp.backend.database;



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
    
        return self.fetchTasksForToday(userId);
    }



}
