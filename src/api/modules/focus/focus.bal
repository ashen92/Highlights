
import webapp.backend.database;
import webapp.backend.http_listener;

import ballerina/http;
import ballerina/io;
import ballerina/log;
import ballerina/sql;
import ballerina/time;

type h_Highlight record {|
    int highlight_id;
    string highlight_name;
|};

type h_TimerDetails record {|
    int timer_id;
    string timer_name;
    time:TimeOfDay? pomo_duration;
    time:TimeOfDay? short_break_duration;
    time:TimeOfDay? long_break_duration;
    int pomos_per_long_break;
    int user_id;
|};

type h_HighlightPomoStartDetails record {
    int timer_id;
    int highlight_id;
    int user_id;
    time:Utc start_time;
    string status;
};

// Intermediate record type for deserialization
type h_HighlightPomoStartDetailsTemp record {
    int timer_id;
    int highlight_id;
    int user_id;
    string start_time;
    string status;
};

type h_HighlightPomoEndDetails record {
    int pomo_id;
    int timer_id;
    int highlight_id;
    int user_id;
    time:Utc end_time;
    string status;
};

// Intermediate record type for deserialization
type h_HighlightPomoEndDetailsTemp record {
    int pomo_id;
    int timer_id;
    int highlight_id;
    int user_id;
    string end_time;
    string status;
};

type h_HighlightStopwatchEndDetails record {
    int stopwatch_id;
    int timer_id;
    int highlight_id;
    int user_id;
    time:Utc end_time;
    string status;
};

// Intermediate record type for deserialization
type h_HighlightStopwatchEndDetailsTemp record {
    int stopwatch_id;
    int timer_id;
    int highlight_id;
    int user_id;
    string end_time;
    string status;
};

type PausesDetails record {
    int pomo_id;
    int highlight_id;
    string pause_time;
    // string continue_time;
};

type PausesDetailsTemp record {
    int pomo_id;
    int highlight_id;
    string pause_time;
    // string continue_time;
};

type h_stopwatch_PausesDetails record {
    int stopwatch_id;
    int highlight_id;
    string pause_time;
    // string continue_time;
};

type h_stopwatch_PausesDetailsTemp record {
    int stopwatch_id;
    int highlight_id;
    string pause_time;
    // string continue_time;
};

type ContinueDetails record {
    int pomo_id;
    int highlight_id;
    // string pause_time;
    string continue_time;
};

type ContinueDetailsTemp record {
    int pomo_id;
    int highlight_id;
    // string pause_time;
    string continue_time;
};

type h_stopwatch_ContinueDetails record {
    int stopwatch_id;
    int highlight_id;
    // string pause_time;
    string continue_time;
};

type h_stopwatch_ContinueDetailsTemp record {
    int stopwatch_id;
    int highlight_id;
    // string pause_time;
    string continue_time;
};

type h_HighlightStopwatchStartDetails record {
    int timer_id;
    int highlight_id;
    int user_id;
    time:Utc start_time;
    string status;
};

// Intermediate record type for deserialization
type h_HighlightStopwatchStartDetailsTemp record {
    int timer_id;
    int highlight_id;
    int user_id;
    string start_time;
    string status;
};

type TimeRecord record {
    int pomo_id;
    int highlight_id;
    string highlight_name;
    string start_time;
    string end_time;
    string status;
    string[][] pause_and_continue_times;
};

type h_StopwatchTimeRecord record {
    int stopwatch_id;
    int highlight_id;
    string highlight_name;
    string start_time;
    string end_time;
    string status;
    string[][] pause_and_continue_times;
};

type FocusRecord record {
    string highlight_id;
    time:TimeOfDay start_time;
    time:TimeOfDay end_time;
};

type PauseContinueDetails record {
    string highlight_id;
    time:TimeOfDay pause_time;
    time:TimeOfDay continue_time;
};

type FocusSummary record {
    FocusRecord focusRecord;
    PauseContinueDetails[] pauseContinueDetails;
};

type PauseContinueRecord record {

    string pause_time;
    string continue_time?;
};

// Define a record to hold the highlight details
type HighlightRecord record {
    int highlight_id;
    string start_time;
    string end_time;
    PauseContinueRecord[] pause_and_continue_times;
};

type h_PauseContinueDetails record {|
    int pomo_id;
    int highlight_id;
    string pause_time;
    string? continue_time;
|};

type h_Stopwatch_PauseContinueDetails record {|
    int stopwatch_id;
    int highlight_id;
    string pause_time;
    string? continue_time;
|};

type h_ActiveHighlightDetails record {|
    int pomo_id;
    int highlight_id;
|};

type h_ActiveStopwatchDetails record {|
    int stopwatch_id;
    int highlight_id;
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
service /focus on http_listener:Listener {
    // resource function get .() returns string {
    //     return "Hello, World!";
    // }

    // Function to get highlights from the database
    resource function get highlights(int userId) returns h_Highlight[]|error {

        sql:ParameterizedQuery sqlQuery = `SELECT id, title FROM Task  WHERE userId = ${userId} AND status != 'completed'`;

        // Execute the query and retrieve the results
        stream<record {|
            int id;
            string title;
        |}, sql:Error?> resultStream = database:Client->query(sqlQuery);

        h_Highlight[] highlightList = [];

        // Iterate over the results
        check from var highlight in resultStream
            do {
                // log:printInfo("Retrieved Highlight: " + highlight.toString());
                highlightList.push({
                    highlight_id: highlight.id,
                    highlight_name: highlight.title
                });
            };

        // io:println(highlightList);

        return highlightList;
    }

    resource function get timer_details() returns h_TimerDetails[]|error {

        sql:ParameterizedQuery sqlQuery = `SELECT * FROM Timer`;

        // Execute the query and retrieve the results
        stream<record {|
            int id;
            string name;
            time:TimeOfDay? pomoDuration;
            time:TimeOfDay? shortBreakDuration;
            time:TimeOfDay? longBreakDuration;
            int pomosPerLongBreak;
            int userId;
        |}, sql:Error?> resultStream = database:Client->query(sqlQuery);

        h_TimerDetails[] h_timerDetailsList = [];

        // Iterate over the results

        // Iterate over the results
        check from var timerDetail in resultStream
            do {
                // log:printInfo("Retrieved TimerDetail: " + timerDetail.toString());
                h_timerDetailsList.push({
                    timer_id: timerDetail.id,
                    timer_name: timerDetail.name,
                    pomo_duration: timerDetail.pomoDuration,
                    short_break_duration: timerDetail.shortBreakDuration,
                    long_break_duration: timerDetail.longBreakDuration,
                    pomos_per_long_break: timerDetail.pomosPerLongBreak,
                    user_id: timerDetail.userId
                });
            };

        // io:println(h_timerDetailsList);

        return h_timerDetailsList;
    }

    resource function post start_pomo_details(http:Caller caller, http:Request req) returns error? {

        json|http:ClientError payload = req.getJsonPayload();

        if payload is http:ClientError {
            log:printError("Error while parsing request payload (highlight_start_pomo_details)", 'error = payload);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        // Convert the payload to the HighlightPomoDetails record
        h_HighlightPomoStartDetailsTemp tempDetails = check payload.cloneWithType(h_HighlightPomoStartDetailsTemp);
        // io:println("Received highlightPomoDetails:", tempDetails);

        // Convert start_time and end_time strings to time:Utc
        time:Utc|error startTime = time:utcFromString(tempDetails.start_time);

        if (startTime is error) {
            log:printError("Error parsing start_time or end_time", 'error = startTime);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }
        time:Utc adjustedStartTime = time:utcAddSeconds(startTime, +(5 * 3600 + 30 * 60));
        // Create HighlightPomoDetails record
        h_HighlightPomoStartDetails highlightDetails = {
            timer_id: tempDetails.timer_id,
            highlight_id: tempDetails.highlight_id,
            user_id: tempDetails.user_id,
            start_time: adjustedStartTime,
            status: tempDetails.status
        };

        string startTimeStr = time:utcToString(highlightDetails.start_time);
        string formattedStartTime = startTimeStr.substring(0, 10) + " " + startTimeStr.substring(11, 19);

        // Insert data into database
        sql:ExecutionResult|sql:Error result = database:Client->execute(`
            INSERT INTO Pomodoro (timerId, highlightId, userId, startTime,  status) 
            VALUES (${highlightDetails.timer_id}, ${highlightDetails.highlight_id}, ${highlightDetails.user_id}, ${formattedStartTime}, ${highlightDetails.status});
        `);

        if result is sql:Error {
            log:printError("Error while inserting data into HighlightPomoDetails", 'error = result);
            check caller->respond(http:STATUS_INTERNAL_SERVER_ERROR);
            return;
        }

        io:println("Started Data inserted successfully");
        check caller->respond(http:STATUS_OK);
    }

    resource function post end_pomo_details(http:Caller caller, http:Request req) returns error? {

        json|http:ClientError payload = req.getJsonPayload();

        if payload is http:ClientError {
            log:printError("Error while parsing request payload (pomo_details)", 'error = payload);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        h_HighlightPomoEndDetailsTemp tempDetails = check payload.cloneWithType(h_HighlightPomoEndDetailsTemp);

        time:Utc|error endTime = time:utcFromString(tempDetails.end_time);

        if (endTime is error) {
            log:printError("Error parsing end_time", 'error = endTime);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        time:Utc adjustedEndTime = time:utcAddSeconds(endTime, +(5 * 3600 + 30 * 60));

        h_HighlightPomoEndDetails highlightPomoDetails = {
            pomo_id: tempDetails.pomo_id,
            timer_id: tempDetails.timer_id,
            highlight_id: tempDetails.highlight_id,
            user_id: tempDetails.user_id,
            end_time: adjustedEndTime,
            status: tempDetails.status
        };

        string endTimeStr = time:utcToString(highlightPomoDetails.end_time);

        string formattedEndTime = endTimeStr.substring(0, 10) + " " + endTimeStr.substring(11, 19);

        sql:ExecutionResult|sql:Error result = database:Client->execute(`
            UPDATE Pomodoro 
            SET endTime = ${formattedEndTime}, status = ${highlightPomoDetails.status}
            WHERE id=${highlightPomoDetails.pomo_id} AND highlightId = ${highlightPomoDetails.highlight_id}  ;
        `);

        if result is sql:Error {
            log:printError("Error while inserting data into HighlightPomoDetails", 'error = result);
            check caller->respond(http:STATUS_INTERNAL_SERVER_ERROR);
            return;
        }

        // io:println("Data inserted successfully");
        check caller->respond(http:STATUS_OK);
    }

    resource function put updateTaskStatus/[int taskId](http:Caller caller, http:Request req) returns error? {

        sql:ExecutionResult|sql:Error result = database:Client->execute(`
        UPDATE Task SET status = 'completed' WHERE id = ${taskId}
    `);

        if result is sql:Error {
            check caller->respond("Task status updated to completed unsccessfully");
            return result;
        }

        check caller->respond("Task status updated to completed successfully");
    }

    resource function post pause_pomo_details(http:Caller caller, http:Request req) returns error? {

        json|http:ClientError payload = req.getJsonPayload();

        if payload is http:ClientError {
            log:printError("Error while parsing request payload (pause_pomo_details)", 'error = payload);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        // Convert the payload to the h_HighlightPomoDetailsTemp record
        PausesDetailsTemp tempDetails = check payload.cloneWithType(PausesDetailsTemp);
        // io:println("Received highlightPomoDetails:", tempDetails);

        // Convert pause_time string to time:Utc
        time:Utc|error pauseTime = time:utcFromString(tempDetails.pause_time);

        if (pauseTime is error) {
            log:printError("Error parsing pause_time", 'error = pauseTime);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        // Create a negative duration of 5 hours and 30 minutes
        time:Utc adjustedPauseTime = time:utcAddSeconds(pauseTime, +(5 * 3600 + 30 * 60));

        // Convert time:Utc to RFC 3339 string
        string adjustedPauseTimeStr = time:utcToString(adjustedPauseTime);

        // Manual formatting from RFC 3339 to "yyyy-MM-dd HH:mm:ss"
        string formattedPauseTime = adjustedPauseTimeStr.substring(0, 10) + " " + adjustedPauseTimeStr.substring(11, 19);

        // Create PausesDetails record with adjusted times
        PausesDetails pausesDetails = {
            pomo_id: tempDetails.pomo_id,
            highlight_id: tempDetails.highlight_id,
            pause_time: formattedPauseTime
        };

        // Insert data into database
        sql:ExecutionResult|sql:Error result = database:Client->execute(`
        INSERT INTO PausePomodoro (highlightId, pomodoroId,  pauseTime) 
        VALUES (${pausesDetails.highlight_id}, ${pausesDetails.pomo_id}, ${pausesDetails.pause_time});
    `);

        if result is sql:Error {
            log:printError("Error while inserting data into HighlightPomoDetails", 'error = result);
            check caller->respond(http:STATUS_INTERNAL_SERVER_ERROR);
            return;
        }

        // io:println("Data inserted successfully");
        check caller->respond(http:STATUS_OK);
    }

    resource function post continue_pomo_details(http:Caller caller, http:Request req) returns error? {

        json|http:ClientError payload = req.getJsonPayload();

        if payload is http:ClientError {
            log:printError("Error while parsing request payload (continue_pomo_details)", 'error = payload);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        // Convert the payload to the h_HighlightPomoDetailsTemp record
        ContinueDetailsTemp tempDetails = check payload.cloneWithType(ContinueDetailsTemp);
        // io:println("Received highlightContinuePomoDetails:", tempDetails);

        // Convert pause_time string to time:Utc
        time:Utc|error continueTime = time:utcFromString(tempDetails.continue_time);

        if (continueTime is error) {
            log:printError("Error parsing pause_time", 'error = continueTime);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        // Create a negative duration of 5 hours and 30 minutes
        time:Utc adjustedContinueTime = time:utcAddSeconds(continueTime, +(5 * 3600 + 30 * 60));

        // Convert time:Utc to RFC 3339 string
        string adjustedContinueTimeStr = time:utcToString(adjustedContinueTime);

        // Manual formatting from RFC 3339 to "yyyy-MM-dd HH:mm:ss"
        string formattedContinueTime = adjustedContinueTimeStr.substring(0, 10) + " " + adjustedContinueTimeStr.substring(11, 19);

        // Create PausesDetails record with adjusted times
        ContinueDetails continueDetails = {
            pomo_id: tempDetails.pomo_id,
            highlight_id: tempDetails.highlight_id,
            continue_time: formattedContinueTime
        };

        sql:ExecutionResult|sql:Error result = database:Client->execute(`
        UPDATE PausePomodoro 
        SET continueTime = ${continueDetails.continue_time} 
        WHERE highlightId = ${continueDetails.highlight_id} AND  pomodoroId = ${continueDetails.pomo_id}
        AND continueTime IS NULL;
    `);

        if result is sql:Error {
            log:printError("Error while updating data into PausesDetails", 'error = result);
            check caller->respond(http:STATUS_INTERNAL_SERVER_ERROR);
            return;
        }

        // io:println("Data inserted successfully");
        check caller->respond(http:STATUS_OK);
    }

    resource function get focus_record/[int userId]() returns TimeRecord[]|error {

        // Query to get all highlights and their names for the given user with non-null end_time
        sql:ParameterizedQuery highlightQuery = `SELECT hpd.id,hpd.highlightId, hh.title, hpd.startTime, hpd.endTime ,hpd.status 
                                             FROM Pomodoro hpd
                                             JOIN Task hh ON hpd.highlightId = hh.id
                                             WHERE hpd.userId = ${userId} AND hpd.endTime IS NOT NULL`;
        stream<record {|int id; int highlightId; string title; time:Utc startTime; time:Utc endTime; string status;|}, sql:Error?> highlightStream = database:Client->query(highlightQuery);
        TimeRecord[] highlightTimeRecords = [];

        // Iterate over the highlight results
        check from var highlight in highlightStream
            do {
                string[][] pauseAndContinueTimes = [];

                // Add the duration to start_time and end_time
                time:Utc newStartTime = time:utcAddSeconds(highlight.startTime, +(5 * 3600 + 30 * 60));
                time:Utc newEndTime = time:utcAddSeconds(highlight.endTime, +(5 * 3600 + 30 * 60));

                // Convert time:Utc to RFC 3339 strings
                string startTimeStr = time:utcToString(newStartTime);
                string endTimeStr = time:utcToString(newEndTime);

                // Manual formatting from RFC 3339 to "yyyy-MM-dd HH:mm:ss"
                string formattedStartTime = startTimeStr.substring(0, 10) + " " + startTimeStr.substring(11, 19);
                string formattedEndTime = endTimeStr.substring(0, 10) + " " + endTimeStr.substring(11, 19);

                TimeRecord timeRecord = {
                    pomo_id: highlight.id,
                    highlight_id: highlight.highlightId,
                    highlight_name: highlight.title,
                    start_time: formattedStartTime,
                    end_time: formattedEndTime,
                    status: highlight.status,
                    pause_and_continue_times: pauseAndContinueTimes
                };

                highlightTimeRecords.push(timeRecord);
            };
        return highlightTimeRecords;
    }

    resource function get active_timer_highlight_details/[int userId]() returns h_ActiveHighlightDetails[]|error {
        // SQL query to retrieve active (uncomplete) highlight timer details
        sql:ParameterizedQuery activeTimerQuery = `SELECT 
                                                hpd.id,
                                                hpd.highlightId
                                              FROM 
                                                Pomodoro hpd
                                              WHERE 
                                                hpd.userId = ${userId} 
                                                AND hpd.endTime IS NULL
                                                AND hpd.status = 'uncomplete'`;

        // Execute the query and retrieve the results
        stream<record {|
            int id;
            int highlightId;
        |}, sql:Error?> resultStream = database:Client->query(activeTimerQuery);

        h_ActiveHighlightDetails[] activeHighlightDetails = [];

        // Iterate over the results
        check from var detail in resultStream
            do {
                h_ActiveHighlightDetails highlightDetail = {
                    pomo_id: detail.id,
                    highlight_id: detail.highlightId
                };

                activeHighlightDetails.push(highlightDetail);
            };

        // io:println(activeHighlightDetails);

        return activeHighlightDetails;
    }

    resource function get pause_details/[int userId]() returns h_PauseContinueDetails[]|error {
        // SQL query to retrieve pause and continue details by pomo_id and highlight_id
        sql:ParameterizedQuery sqlQuery = `SELECT 
                                        h.id,
                                        h.highlightId, 
                                        p.pauseTime, 
                                        p.continueTime 
                                      FROM 
                                        Pomodoro h 
                                      JOIN 
                                        PausePomodoro p 
                                      ON 
                                        h.id = p.pomodoroId 
                                      WHERE 
                                        h.userId = ${userId}`;

        // Execute the query and retrieve the results
        stream<record {|
            int id;
            int highlightId;
            time:Utc pauseTime;
            time:Utc? continueTime;
        |}, sql:Error?> resultStream = database:Client->query(sqlQuery);

        h_PauseContinueDetails[] pauseContinueDetails = [];

        // Iterate over the results
        check from var pauseDetail in resultStream
            do {
                // Add the duration to pause_time and continue_time
                time:Utc newPauseTime = time:utcAddSeconds(pauseDetail.pauseTime, +(5 * 3600 + 30 * 60));
                time:Utc? newContinueTime = pauseDetail.continueTime != () ? time:utcAddSeconds(<time:Utc>pauseDetail.continueTime, +(5 * 3600 + 30 * 60)) : ();

                // Convert time:Utc to RFC 3339 strings
                string pauseTimeStr = time:utcToString(newPauseTime);
                string? continueTimeStr = newContinueTime != () ? time:utcToString(newContinueTime) : ();

                // Manual formatting from RFC 3339 to "yyyy-MM-dd HH:mm:ss"
                string formattedPauseTime = pauseTimeStr.substring(0, 10) + " " + pauseTimeStr.substring(11, 19);
                string? formattedContinueTime = continueTimeStr != () ? continueTimeStr.substring(0, 10) + " " + continueTimeStr.substring(11, 19) : ();

                h_PauseContinueDetails pauseContinueDetail = {
                    pomo_id: pauseDetail.id,
                    highlight_id: pauseDetail.highlightId,
                    pause_time: formattedPauseTime,
                    continue_time: formattedContinueTime
                };

                pauseContinueDetails.push(pauseContinueDetail);
            };

        // io:println(pauseContinueDetails);

        return pauseContinueDetails;
    }

    resource function post start_stopwatch_details(http:Caller caller, http:Request req) returns error? {

        json|http:ClientError payload = req.getJsonPayload();

        if payload is http:ClientError {
            log:printError("Error while parsing request payload (highlight_start_pomo_details)", 'error = payload);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        // Convert the payload to the HighlightPomoDetails record
        h_HighlightStopwatchStartDetailsTemp tempDetails = check payload.cloneWithType(h_HighlightStopwatchStartDetailsTemp);
        // io:println("Received highlightStopwatchDetails:", tempDetails);

        // Convert start_time and end_time strings to time:Utc
        time:Utc|error startTime = time:utcFromString(tempDetails.start_time);

        if (startTime is error) {
            log:printError("Error parsing start_time or end_time", 'error = startTime);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }
        time:Utc adjustedStartTime = time:utcAddSeconds(startTime, +(5 * 3600 + 30 * 60));
        // Create HighlightPomoDetails record
        h_HighlightPomoStartDetails highlightDetails = {
            timer_id: tempDetails.timer_id,
            highlight_id: tempDetails.highlight_id,
            user_id: tempDetails.user_id,
            start_time: adjustedStartTime,
            status: tempDetails.status
        };

        string startTimeStr = time:utcToString(highlightDetails.start_time);
        string formattedStartTime = startTimeStr.substring(0, 10) + " " + startTimeStr.substring(11, 19);

        // Insert data into database
        sql:ExecutionResult|sql:Error result = database:Client->execute(`
            INSERT INTO Stopwatch (timerId, highlightId, userId, startTime,  status) 
            VALUES (${highlightDetails.timer_id}, ${highlightDetails.highlight_id}, ${highlightDetails.user_id}, ${formattedStartTime}, ${highlightDetails.status});
        `);

        if result is sql:Error {
            log:printError("Error while inserting data into HighlightPomoDetails", 'error = result);
            check caller->respond(http:STATUS_INTERNAL_SERVER_ERROR);
            return;
        }

        // io:println("Started Data inserted successfully");
        check caller->respond(http:STATUS_OK);
    }

    resource function get active_stopwatch_highlight_details/[int userId]() returns h_ActiveStopwatchDetails[]|error {
        // SQL query to retrieve active (uncomplete) highlight timer details
        sql:ParameterizedQuery activeTimerQuery = `SELECT 
                                                hpd.id,
                                                hpd.highlightId
                                              FROM 
                                                Stopwatch hpd
                                              WHERE 
                                                hpd.userId = ${userId} 
                                                AND hpd.endTime IS NULL
                                                AND hpd.status = 'uncomplete'`;

        // Execute the query and retrieve the results
        stream<record {|
            int id;
            int highlightId;
        |}, sql:Error?> resultStream = database:Client->query(activeTimerQuery);

        h_ActiveStopwatchDetails[] activeStopwatchDetails = [];

        // Iterate over the results
        check from var detail in resultStream
            do {
                h_ActiveStopwatchDetails highlightDetail = {
                    stopwatch_id: detail.id,
                    highlight_id: detail.highlightId
                };

                activeStopwatchDetails.push(highlightDetail);
            };

        // io:println("activeStopwatchDetails------------>>", activeStopwatchDetails);

        return activeStopwatchDetails;
    }

    resource function post end_stopwatch_details(http:Caller caller, http:Request req) returns error? {

        json|http:ClientError payload = req.getJsonPayload();

        if payload is http:ClientError {
            log:printError("Error while parsing request payload (pomo_details)", 'error = payload);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        h_HighlightStopwatchEndDetailsTemp tempDetails = check payload.cloneWithType(h_HighlightStopwatchEndDetailsTemp);

        time:Utc|error endTime = time:utcFromString(tempDetails.end_time);

        if (endTime is error) {
            log:printError("Error parsing end_time", 'error = endTime);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        time:Utc adjustedEndTime = time:utcAddSeconds(endTime, +(5 * 3600 + 30 * 60));

        h_HighlightStopwatchEndDetails highlightStopwatchDetails = {
            stopwatch_id: tempDetails.stopwatch_id,
            timer_id: tempDetails.timer_id,
            highlight_id: tempDetails.highlight_id,
            user_id: tempDetails.user_id,
            end_time: adjustedEndTime,
            status: tempDetails.status
        };

        string endTimeStr = time:utcToString(highlightStopwatchDetails.end_time);

        string formattedEndTime = endTimeStr.substring(0, 10) + " " + endTimeStr.substring(11, 19);

        sql:ExecutionResult|sql:Error result = database:Client->execute(`
            UPDATE Stopwatch 
            SET endTime = ${formattedEndTime}, status = ${highlightStopwatchDetails.status}
            WHERE id=${highlightStopwatchDetails.stopwatch_id} AND highlightId = ${highlightStopwatchDetails.highlight_id}  ;
        `);

        if result is sql:Error {
            log:printError("Error while inserting data into HighlightPomoDetails", 'error = result);
            check caller->respond(http:STATUS_INTERNAL_SERVER_ERROR);
            return;
        }

        // io:println("End Data inserted successfully");
        check caller->respond(http:STATUS_OK);
    }

    resource function post pause_stopwatch_details(http:Caller caller, http:Request req) returns error? {

        json|http:ClientError payload = req.getJsonPayload();

        if payload is http:ClientError {
            log:printError("Error while parsing request payload (pause_stopwatch_details)", 'error = payload);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        // Convert the payload to the h_HighlightPomoDetailsTemp record
        h_stopwatch_PausesDetailsTemp tempDetails = check payload.cloneWithType(h_stopwatch_PausesDetailsTemp);
        // io:println("Received highlightPomoDetails:", tempDetails);

        // Convert pause_time string to time:Utc
        time:Utc|error pauseTime = time:utcFromString(tempDetails.pause_time);

        if (pauseTime is error) {
            log:printError("Error parsing pause_time", 'error = pauseTime);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        // Create a negative duration of 5 hours and 30 minutes
        time:Utc adjustedPauseTime = time:utcAddSeconds(pauseTime, +(5 * 3600 + 30 * 60));

        // Convert time:Utc to RFC 3339 string
        string adjustedPauseTimeStr = time:utcToString(adjustedPauseTime);

        // Manual formatting from RFC 3339 to "yyyy-MM-dd HH:mm:ss"
        string formattedPauseTime = adjustedPauseTimeStr.substring(0, 10) + " " + adjustedPauseTimeStr.substring(11, 19);

        // Create PausesDetails record with adjusted times
        h_stopwatch_PausesDetails pausesDetails = {
            stopwatch_id: tempDetails.stopwatch_id,
            highlight_id: tempDetails.highlight_id,
            pause_time: formattedPauseTime
        };

        // Insert data into database
        sql:ExecutionResult|sql:Error result = database:Client->execute(`
        INSERT INTO PauseStopwatch (highlightId, stopwatchId,  pauseTime) 
        VALUES (${pausesDetails.highlight_id}, ${pausesDetails.stopwatch_id}, ${pausesDetails.pause_time});
    `);

        if result is sql:Error {
            log:printError("Error while inserting data into HighlightPomoDetails", 'error = result);
            check caller->respond(http:STATUS_INTERNAL_SERVER_ERROR);
            return;
        }

        // io:println("Data inserted successfully");
        check caller->respond(http:STATUS_OK);
    }

    resource function post continue_stopwatch_details(http:Caller caller, http:Request req) returns error? {

        json|http:ClientError payload = req.getJsonPayload();

        if payload is http:ClientError {
            log:printError("Error while parsing request payload (continue_stopwatch_details)", 'error = payload);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }
        h_stopwatch_ContinueDetailsTemp tempDetails = check payload.cloneWithType(h_stopwatch_ContinueDetailsTemp);

        time:Utc|error continueTime = time:utcFromString(tempDetails.continue_time);

        if (continueTime is error) {
            log:printError("Error parsing pause_time", 'error = continueTime);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        time:Utc adjustedContinueTime = time:utcAddSeconds(continueTime, +(5 * 3600 + 30 * 60));

        string adjustedContinueTimeStr = time:utcToString(adjustedContinueTime);

        string formattedContinueTime = adjustedContinueTimeStr.substring(0, 10) + " " + adjustedContinueTimeStr.substring(11, 19);

        h_stopwatch_ContinueDetails continueDetails = {
            stopwatch_id: tempDetails.stopwatch_id,
            highlight_id: tempDetails.highlight_id,
            continue_time: formattedContinueTime
        };

        sql:ExecutionResult|sql:Error result = database:Client->execute(`
        UPDATE PauseStopwatch 
        SET continueTime = ${continueDetails.continue_time} 
        WHERE highlightId = ${continueDetails.highlight_id} AND  stopwatchId = ${continueDetails.stopwatch_id}
        AND continueTime IS NULL;
    `);

        if result is sql:Error {
            log:printError("Error while updating data into PausesDetails", 'error = result);
            check caller->respond(http:STATUS_INTERNAL_SERVER_ERROR);
            return;
        }

        check caller->respond(http:STATUS_OK);
    }

    resource function get stopwatch_focus_record/[int userId]() returns h_StopwatchTimeRecord[]|error {

        sql:ParameterizedQuery highlightQuery = `SELECT hpd.id,hpd.highlightId, hh.title, hpd.startTime, hpd.endTime ,hpd.status 
                                             FROM Stopwatch hpd
                                             JOIN Task hh ON hpd.highlightId = hh.id
                                             WHERE hpd.userId = ${userId} AND hpd.endTime IS NOT NULL`;
        stream<record {|int id; int highlightId; string title; time:Utc startTime; time:Utc endTime; string status;|}, sql:Error?> highlightStream = database:Client->query(highlightQuery);

        h_StopwatchTimeRecord[] highlightTimeRecords = [];

        check from var highlight in highlightStream
            do {
                string[][] pauseAndContinueTimes = [];

                time:Utc newStartTime = time:utcAddSeconds(highlight.startTime, +(5 * 3600 + 30 * 60));
                time:Utc newEndTime = time:utcAddSeconds(highlight.endTime, +(5 * 3600 + 30 * 60));

                string startTimeStr = time:utcToString(newStartTime);
                string endTimeStr = time:utcToString(newEndTime);

                // Manual formatting from RFC 3339 to "yyyy-MM-dd HH:mm:ss"
                string formattedStartTime = startTimeStr.substring(0, 10) + " " + startTimeStr.substring(11, 19);
                string formattedEndTime = endTimeStr.substring(0, 10) + " " + endTimeStr.substring(11, 19);

                h_StopwatchTimeRecord timeRecord = {
                    stopwatch_id: highlight.id,
                    highlight_id: highlight.highlightId,
                    highlight_name: highlight.title,
                    start_time: formattedStartTime,
                    end_time: formattedEndTime,
                    status: highlight.status,
                    pause_and_continue_times: pauseAndContinueTimes
                };

                highlightTimeRecords.push(timeRecord);
            };
        // io:println(highlightTimeRecords);
        return highlightTimeRecords;
    }

    resource function get stopwatch_pause_details/[int userId]() returns h_Stopwatch_PauseContinueDetails[]|error {

        sql:ParameterizedQuery sqlQuery = `SELECT 
                                        h.id,
                                        h.highlightId, 
                                        p.pauseTime, 
                                        p.continueTime 
                                      FROM 
                                        Stopwatch h 
                                      JOIN 
                                        PauseStopwatch p 
                                      ON 
                                        h.id = p.stopwatchId 
                                      WHERE 
                                        h.userId = ${userId}`;

        stream<record {|
            int id;
            int highlightId;
            time:Utc pauseTime;
            time:Utc? continueTime;
        |}, sql:Error?> resultStream = database:Client->query(sqlQuery);

        h_Stopwatch_PauseContinueDetails[] pauseContinueDetails = [];

        check from var pauseDetail in resultStream
            do {

                time:Utc newPauseTime = time:utcAddSeconds(pauseDetail.pauseTime, +(5 * 3600 + 30 * 60));
                time:Utc? newContinueTime = pauseDetail.continueTime != () ? time:utcAddSeconds(<time:Utc>pauseDetail.continueTime, +(5 * 3600 + 30 * 60)) : ();

                string pauseTimeStr = time:utcToString(newPauseTime);
                string? continueTimeStr = newContinueTime != () ? time:utcToString(newContinueTime) : ();

                // Manual formatting from RFC 3339 to "yyyy-MM-dd HH:mm:ss"
                string formattedPauseTime = pauseTimeStr.substring(0, 10) + " " + pauseTimeStr.substring(11, 19);
                string? formattedContinueTime = continueTimeStr != () ? continueTimeStr.substring(0, 10) + " " + continueTimeStr.substring(11, 19) : ();

                h_Stopwatch_PauseContinueDetails pauseContinueDetail = {
                    stopwatch_id: pauseDetail.id,
                    highlight_id: pauseDetail.highlightId,
                    pause_time: formattedPauseTime,
                    continue_time: formattedContinueTime
                };

                pauseContinueDetails.push(pauseContinueDetail);
            };

        // io:println(pauseContinueDetails);

        return pauseContinueDetails;
    }

}
