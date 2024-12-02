import webapp.backend.database;

import ballerina/http;
// import ballerina/io;
import ballerina/lang.runtime;
import ballerina/lang.value;
import ballerina/regex;
import ballerina/sql;
import ballerina/time;
import ballerina/websocket;
// import ballerinax/mysql.driver as _;


@http:ServiceConfig {
    cors: {
        allowOrigins: ["http://localhost:3000"],
        allowCredentials: false,
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
        maxAge: 84900
    }
}

service / on new websocket:Listener(9091) {

    resource function get .() returns websocket:Service {
        return new ReminderService();
    }
}

service class ReminderService {
    *websocket:Service;

    int userId = 0;

    remote function onOpen(websocket:Caller caller) returns error? {
        // io:println("New client connected");
    }

    remote function onMessage(websocket:Caller caller, string message) returns error? {
        // Parse the incoming message to get the userId
        json|error parsedMessage = value:fromJsonString(message);

        if (parsedMessage is json && parsedMessage.userId is int) {
            self.userId = check parsedMessage.userId;

            // io:println("Received userId: ", self.userId);

            error? reminderCheckResult = self.startReminderCheck(caller);
            if (reminderCheckResult is error) {
                // io:println("Error starting reminder check: ", reminderCheckResult.message());
            }
        } else {
            // io:println("Invalid userId received.");
        }
    }









    function startReminderCheck(websocket:Caller caller) returns error? {
        
        

    while true {

        runtime:sleep(1);

        time:Utc currTime = time:utcNow();
        time:Utc newCurrTime = time:utcAddSeconds(currTime, +(5 * 3600 + 30 * 60));

        string currTimeStr = time:utcToString(newCurrTime);
        string currTimeStrNew = currTimeStr.substring(0, 19);

        // io:println("Received userId: ---------------------", self.userId);

        sql:ParameterizedQuery query = `SELECT id, title, startTime, reminder
                                        FROM Task 
                                        WHERE userId = ${self.userId}`;

        stream<record {|int id; string title; time:Utc startTime; string reminder;|}, sql:Error?> resultStream = database:Client->query(query);

        check from var task in resultStream
            do {
                // io:println("Reminder value: ", task.reminder);

                // Use regular expression to extract the number (minutes) from the reminder string
                string reminderStr = task.reminder;
                string[] parts = regex:split(reminderStr, " "); 
                int reminderMinutes = 0;

                // Check if the string has "Before" and the numeric part is present
                if (parts.length() >= 2) {
                    reminderMinutes = check 'int:fromString(parts[1]);
                }

                // io:println("Parsed reminder (in minutes): ", reminderMinutes);

                time:Utc newstartTime = time:utcAddSeconds(task.startTime, +(5 * 3600 + 30 * 60));

                time:Utc reminderTime = time:utcAddSeconds(newstartTime, -(reminderMinutes * 60));

                string reminderTimeStr = time:utcToString(reminderTime);
                string startTimeStr = time:utcToString(newstartTime);

                string reminderTimeStrFormatted = reminderTimeStr.substring(0, 19);
                string startTimeStrFormatted = startTimeStr.substring(0, 19);

                string[] startDateTimeParts = regex:split(startTimeStrFormatted, "T");

                string startDate = startDateTimeParts[0];
                string startTime = startDateTimeParts[1];

                // Check if it's time to send the reminder notification
                if (reminderTimeStrFormatted == currTimeStrNew) {
                    // io:println("Task Start Time: ", task.startTime);
                    json reminderNotification = {
                        "id": task.id,
                        "title": task.title,
                        "startDate": startDate,
                        "startTime": startTime,
                        "message": "Reminder: Your highlight titled '" + task.title + "' is about to start on " + startDate + " at " + startTime + "."
                    };
                    // io:println("reminderNotification: ", reminderNotification);

                    // Send the reminder notification to the client
                    error? sendError = caller->writeMessage(reminderNotification);
                    if (sendError is error) {
                        // io:println("Error sending reminder: ", sendError.message());
                    }
                }
            };
    }
}


}
