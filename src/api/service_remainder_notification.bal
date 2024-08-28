import webapp.backend.database;
import webapp.backend.lists as _;
import ballerina/http;
import ballerina/io;
import ballerinax/mysql.driver as _;
import ballerina/websocket;
import ballerina/lang.runtime;
import ballerina/sql;
import ballerinax/mysql.driver as _;
import ballerina/lang.value;
import ballerina/time;
import ballerina/regex;

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

    int userId = 1;

    remote function onOpen(websocket:Caller caller) returns error? {
        io:println("New client connected");
    }

remote function onMessage(websocket:Caller caller, string message) returns error? {
    // Parse the incoming message to get the userId
    json|error parsedMessage = value:fromJsonString(message);
    
    if parsedMessage is error {
        io:println("Error parsing message: ", parsedMessage.message());
        return parsedMessage; // Return the error so it can be handled by the framework
    }
    
    // Extract userId from the parsed JSON
    json receivedJson = parsedMessage;
    if receivedJson.userId is int {
        self.userId = check receivedJson.userId;
        io:println("User ID received: ", self.userId);

        // Start the reminder checking process
        error? startReminderCheckResult = self.startReminderCheck(caller);
        if startReminderCheckResult is error {
            io:println("Error starting reminder check: ", startReminderCheckResult.message());
            return startReminderCheckResult; // Return the error if there is an issue
        }
    } else {
        io:println("Invalid userId received.");
    }

    return; // Return nil, indicating the function completed successfully without error
}








// function startReminderCheck(websocket:Caller caller) returns error? {
//     while true {
//         runtime:sleep(1);

//         time:Utc currTime = time:utcNow();
  
//         time:Utc newcurrTime = time:utcAddSeconds(currTime, +(5 * 3600 + 30 * 60));

//         string currTimeStr = time:utcToString(newcurrTime);

//         string currTimeStrNew = currTimeStr.substring(0, 19); 

//         int userId = 1;

//         // Query to check if any task's startTime matches the current time for the user
//         sql:ParameterizedQuery query = `SELECT id, title, startTime
//                                         FROM Task 
//                                         WHERE userId = ${userId} AND startTime=${currTimeStrNew}` ;

//         stream<record {| int id; string title; time:Utc startTime; |}, sql:Error?> resultStream = database:Client->query(query);

//         check from var task in resultStream
//             do {
                
//                 io:println("///////////satrt time   first----- ", task.startTime);
//                 time:Utc startTime = time:utcAddSeconds(task.startTime, +(5 * 3600 + 30 * 60));

//                 string startTimeStr = time:utcToString(startTime);
//                 string taskStartTimeStr = startTimeStr.substring(0, 19); // "yyyy-MM-ddTHH:mm:ss" format
//                 io:println("///////////satrt time----- ", taskStartTimeStr);
//                 json reminderNotification = {
//                     "id": task.id,
//                     "title": task.title,
//                     "startTime": task.startTime,
//                     "message": "Reminder: Your task '" + task.title + "' is about to start! startTime"
//                 };

//                 // Send the reminder notification to the client
//                 error? sendError = caller->writeMessage(reminderNotification);
//                 if (sendError is error) {
//                     io:println("Error sending reminder: ", sendError.message());
//                 }
//             };

//         // io:println("Reminder check completed.");
//     }
// }






// Assume `database:Client` and `websocket:Caller` are properly initialized

function startReminderCheck(websocket:Caller caller) returns error? {
    while true {

        runtime:sleep(1);

        time:Utc currTime = time:utcNow();
        time:Utc newCurrTime = time:utcAddSeconds(currTime, +(5 * 3600 + 30 * 60)); 

        string currTimeStr = time:utcToString(newCurrTime);
        string currTimeStrNew = currTimeStr.substring(0, 19); 

        int userId = 1;

        sql:ParameterizedQuery query = `SELECT id, title, startTime, reminder
                                        FROM Task 
                                        WHERE userId = ${userId}`;

        stream<record {| int id; string title; time:Utc startTime; string reminder; |}, sql:Error?> resultStream = database:Client->query(query);

        check from var task in resultStream
            do {

                int reminderMinutes = check 'int:fromString(task.reminder);

                time:Utc newstartTime = time:utcAddSeconds(task.startTime, +(5 * 3600 + 30 * 60)); 

                time:Utc reminderTime = time:utcAddSeconds(newstartTime, -(reminderMinutes * 60));

                string reminderTimeStr = time:utcToString(reminderTime);
                string startTimeStr = time:utcToString(newstartTime);

                string reminderTimeStrFormatted = reminderTimeStr.substring(0, 19); 
                string startTimeStrFormatted = startTimeStr.substring(0, 19); 

                string[] startDateTimeParts = regex:split(startTimeStrFormatted, "T");

                string startDate = startDateTimeParts[0];
                string startTime = startDateTimeParts[1];
        
  
                if (reminderTimeStrFormatted == currTimeStrNew) {
                    io:println("Task Start Time: ", task.startTime);
                    json reminderNotification = {
                        "id": task.id,
                        "title": task.title,
                        "startDate": startDate,
                        "startTime": startTime,
                        "message": "Reminder: Your highlight titled '" + task.title + "' is about to start on " + startDate + " at " + startTime + "."
                    };
                    io:println("reminderNotification: ", reminderNotification);

                    // Send the reminder notification to the client
                    error? sendError = caller->writeMessage(reminderNotification);
                    if (sendError is error) {
                        io:println("Error sending reminder: ", sendError.message());
                    }
                }
            };

    }
}
















}