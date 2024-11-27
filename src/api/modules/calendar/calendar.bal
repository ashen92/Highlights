import webapp.backend.database;
import webapp.backend.http_listener;

import ballerina/http;
// import ballerina/io;
import ballerina/sql;
import ballerina/time;

// Define the type to match FullCalendar's event structure
public type CalendarEvent record {
    int id;
    string title;
    string? description;
    string start_time;
    string? end_time;
    string? dueDate;
    string? reminder;
    string priority;
    string label;
    string status;
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
service /calendar on http_listener:Listener {

    resource function get highlights/[int userId]() returns CalendarEvent[]|error {
        // Define the SQL query
        sql:ParameterizedQuery sqlQuery = `SELECT 
        id, title, description, dueDate, startTime, endTime, reminder, 
        priority, label, status, userId 
        FROM Task WHERE userId = ${userId}`;

        // Execute the query and retrieve the results
        stream<record {|
            int id;
            string title;
            string? description;
            time:Utc? dueDate;
            time:Utc? startTime;
            time:Utc? endTime;
            string? reminder;
            string priority;
            string label;
            string status;
            int userId;
        |}, sql:Error?> resultStream = database:Client->query(sqlQuery);

        CalendarEvent[] eventList = [];

        // Iterate over the results
        check from var task in resultStream
            do {
                time:Utc newDueDateTime = time:utcAddSeconds(<time:Utc>task.dueDate, +(5 * 3600 + 30 * 60));
                time:Utc newStartTime = time:utcAddSeconds(<time:Utc>task.startTime, +(5 * 3600 + 30 * 60));
                time:Utc newEndTime = time:utcAddSeconds(<time:Utc>task.endTime, +(5 * 3600 + 30 * 60));

                string dueDateTimeStr = time:utcToString(newDueDateTime);
                string startTimeStr = time:utcToString(newStartTime);
                string endTimeStr = time:utcToString(newEndTime);

                string formattedDueDateTime = dueDateTimeStr.substring(0, 10) + " " + dueDateTimeStr.substring(11, 19);
                string formattedStartTime = startTimeStr.substring(0, 10) + " " + startTimeStr.substring(11, 19);
                string formattedEndTime = endTimeStr.substring(0, 10) + " " + endTimeStr.substring(11, 19);

               

                // Push to eventList
                eventList.push({
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    start_time: formattedStartTime,
                    end_time: formattedEndTime,
                    dueDate: formattedDueDateTime,
                    reminder: task.reminder,
                    priority: task.priority,
                    label: task.label,
                    status: task.status,
                    userId: task.userId
                });
            };

        // io:println("Event List:", eventList);
        return eventList;
    }
}
