import webapp.backend.http_listener;
import webapp.backend.database;
import ballerina/http;
import ballerina/sql;
import ballerina/time;
import ballerina/io;

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
    auth: [{
        jwtValidatorConfig: {
            issuer: azureAdIssuer,
            audience: azureAdAudience,
            scopeKey: "scp"
        },
        scopes: ["User.Read"]
    }],
    cors: {
        allowOrigins: corsAllowOrigins,
        allowCredentials: false,
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
        maxAge: 84900
    }
}
service /calendar on http_listener:Listener {

    resource function get highlights() returns CalendarEvent[]|error {
        // Define the SQL query
        sql:ParameterizedQuery sqlQuery = `
            SELECT 
                id, title, description, dueDate, startTime, endTime, reminder, 
                priority, label, status, userId 
            FROM Task
        `;

        // Execute the query and retrieve the results
        stream<record {| 
            int id;
            string title;
            string? description;
            string? dueDate;
            string? startTime;
            string? endTime;
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
                // Determine the correct 'start' time and handle the optional 'end' and 'dueDate' fields
                string startTimeStr = task.startTime != "" ? task.startTime.toString() : (task.dueDate is string && task.dueDate != "" ? <string>task.dueDate : "");
                string? endTimeStr = task.endTime is string ? task.endTime : "";

                // Convert string to time:Utc for time manipulation
                time:Utc? startUtc = startTimeStr != "" ? check time:utcFromString(startTimeStr) : null;
                time:Utc? endUtc = endTimeStr != "" ? check time:utcFromString(<string>endTimeStr) : null;

                // Add 5 hours and 30 minutes to both start and end times
                if (startUtc is time:Utc) {
                    startUtc = time:utcAddSeconds(startUtc, +(5 * 3600 + 30 * 60)); // Add 5 hours and 30 minutes
                }
                if (endUtc is time:Utc) {
                    endUtc = time:utcAddSeconds(endUtc, +(5 * 3600 + 30 * 60)); // Add 5 hours and 30 minutes
                }

                // Convert back to string (RFC 3339 format)
                string? newStartTime = startUtc is time:Utc ? time:utcToString(startUtc) : "";
                string? newEndTime = endUtc is time:Utc ? time:utcToString(endUtc) : "";

                // Format time from RFC 3339 to "yyyy-MM-dd HH:mm:ss"
                string formattedStartTime = newStartTime is string && newStartTime != "" ? newStartTime.substring(0, 10) + " " + newStartTime.substring(11, 19) : "";
                string formattedEndTime = newEndTime is string && newEndTime != "" ? newEndTime.substring(0, 10) + " " + newEndTime.substring(11, 19) : "";

                // Push to eventList
                eventList.push({
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    start_time: formattedStartTime,
                    end_time: formattedEndTime,
                    dueDate: task.dueDate is string ? task.dueDate : "",
                    reminder: task.reminder,
                    priority: task.priority,
                    label: task.label,
                    status: task.status,
                    userId: task.userId
                });
            };
        io:println("eventList", eventList);
        return eventList;
    }
}
