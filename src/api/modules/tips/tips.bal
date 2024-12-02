import webapp.backend.database;
import webapp.backend.http_listener;

import ballerina/http;
import ballerina/log;
import ballerina/sql;
import ballerina/time;

type DailyTip record {
    int id;
    string label;
    string tip;
    int rate;
    // time:Date date;
};

type CreateDailyTip record {|
    string label;
    string tip;
    // int rate;
    // time:Date date;
|};

type Feedback record {|
    int tipId;
    boolean isUseful;
|};

type UserPreference record {
    int user_id;
    string label;
};

type CreateUserPreference record {|
    int user_id;
    string[] labels;
|};

configurable string azureAdIssuer = ?;
configurable string azureAdAudience = ?;
configurable string[] corsAllowOriginsTips = ?;

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
        allowOrigins: corsAllowOriginsTips,
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
service /tips on http_listener:Listener {
    // Create a new daily tip
    private function tipps(CreateDailyTip dailyTip) returns error? {
        // Get the current UTC time
        time:Utc currentTime = time:utcNow();

        // Convert it to a Civil time
        time:Civil currentDate = time:utcToCivil(currentTime);

        string formattedDate = string `${currentDate.year}-${currentDate.month}-${currentDate.day}`;
        // io:println("zzzzzzzzzzzzzzzzzzzzz");

        sql:ExecutionResult|sql:Error result = database:Client->execute(`
            INSERT INTO DailyTip (label, tip, rate, date) VALUES (${dailyTip.label}, ${dailyTip.tip}, 10, ${formattedDate});
        `);

        if (result is sql:ApplicationError) {
            log:printError("Error occurred while inserting daily tip", 'error = result);
            return result;
        }
        return ();
    }

    // Fetch daily tips
    private function fetchDailyTips() returns DailyTip[]|error {
        sql:ParameterizedQuery query = `SELECT id, label, tip, rate FROM DailyTip ORDER BY id DESC`;
        stream<DailyTip, sql:Error?> resultStream = database:Client->query(query);
        DailyTip[] dailyTipList = [];
        error? e = resultStream.forEach(function(DailyTip dailyTip) {
            dailyTipList.push(dailyTip);
        });

        if (e is error) {
            log:printError("Error occured while fetching daily tips: ", 'error = e);
            return e;
        }

        check resultStream.close();
        return dailyTipList;
    }

    // Update a dailytip by ID
    private function updateDailyTip(int tipId, string label, string tip) returns error? {
        sql:ExecutionResult|sql:Error result = database:Client->execute(`
            UPDATE DailyTip SET label = ${label}, tip = ${tip} WHERE id = ${tipId};
        `);

        if (result is sql:Error) {
            log:printError("Error occurred while updating daily tip", 'error = result);
            return result;
        }

        return ();
    }

    // Endpoint to create a new daily tip
    resource function POST tips(http:Caller caller, http:Request req) returns error? {

        json|http:ClientError payload = req.getJsonPayload();
        if (payload is http:ClientError) {
            log:printError("Error while parsing request payload", 'error = payload);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }
        CreateDailyTip|error dailyTip = payload.cloneWithType(CreateDailyTip);
        if (dailyTip is error) {
            log:printError("Error while converting JSON to CreateDailyTip", 'error = dailyTip);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        error? result = self.tipps(dailyTip);
        if (result is error) {
            check caller->respond(http:STATUS_INTERNAL_SERVER_ERROR);
            return;
        }

        check caller->respond(http:STATUS_CREATED);
    }

    // Endpoint to fetch daily tips
    resource function GET all() returns DailyTip[]|error {
        return self.fetchDailyTips();
    }

    // Endpoint to update a daily tip
    resource function PUT updatetips/[int tipId](http:Caller caller, http:Request req) returns error? {

        json|http:ClientError payload = req.getJsonPayload();
        if payload is http:ClientError {
            log:printError("Error while parsing request payload", 'error = payload);

            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        DailyTip|error tip = payload.cloneWithType(DailyTip);
        if tip is error {
            log:printError("Error while converting JSON to Task", 'error = tip);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        sql:ExecutionResult|sql:Error result = database:Client->execute(`
        UPDATE DailyTip SET label = ${tip.label}, 
                      tip = ${tip.tip} 
        WHERE id = ${tipId};
    `);

        if result is sql:Error {
            log:printError("Error occurred while updating task", 'error = result);
            check caller->respond(http:STATUS_INTERNAL_SERVER_ERROR);
        } else {
            check caller->respond(http:STATUS_OK);
        }
    }

    // Delete dailytip
    resource function DELETE tips/[int tipId](http:Caller caller) returns error? {
        // io:println("xdd");
        sql:ExecutionResult|sql:Error result = database:Client->execute(`
            DELETE FROM DailyTip WHERE id = ${tipId};
        `);

        if result is sql:Error {
            log:printError("Error occurred while deleting task", result);
            check caller->respond(http:STATUS_INTERNAL_SERVER_ERROR);
        } else {
            check caller->respond(http:STATUS_OK);
        }
    }

    // Load random tip
    resource function GET randomTip() returns DailyTip?|error {
        sql:ParameterizedQuery query = `SELECT id, label, tip FROM DailyTip WHERE rate > 0 ORDER BY RAND() LIMIT 1`;

        stream<DailyTip, sql:Error?> resultStream = database:Client->query(query);
        DailyTip? randomTip = ();

        error? e = resultStream.forEach(function(DailyTip dailyTip) {
            randomTip = dailyTip;
        });

        if (e is error) {
            log:printError("Error occurred while fetching random daily tip: ", 'error = e);
            return e;
        }

        check resultStream.close();

        // Handle the case when no tip was found (randomTip is null)
        if randomTip is () {
            return error("No tip found");
        }

        // Return the random tip
        return randomTip;
    }

    // update rate in DailyTip table
    resource function POST feedback(http:Caller caller, http:Request req) returns error? {
        // io:println("ABCABC.......");
        json|http:ClientError payload = req.getJsonPayload();
        if (payload is http:ClientError) {
            log:printError("Error while parsing request payload", 'error = payload);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        Feedback|error feedback = payload.cloneWithType(Feedback);
        if (feedback is error) {
            log:printError("Error while converting JSON to FeedbackPayload", 'error = feedback);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        int rateAdjustment = feedback.isUseful ? 1 : -1;
        error? result = self.updateTipRate(feedback.tipId, rateAdjustment);
        if (result is error) {
            check caller->respond(http:STATUS_INTERNAL_SERVER_ERROR);
            return;
        }

        check caller->respond(http:STATUS_OK);
    }

    private function updateTipRate(int tipId, int rateAdjustment) returns error? {
        sql:ExecutionResult|sql:Error result = database:Client->execute(`
        UPDATE DailyTip SET rate = rate + ${rateAdjustment} WHERE id = ${tipId};
    `);

        if (result is sql:Error) {
            log:printError("Error occurred while updating rate", 'error = result);
            return result;
        }

        return ();
    }

    // Function to insert user preferences to the database
    private function insertUserPreferences(CreateUserPreference UserPreference) returns error? {
        foreach string label in UserPreference.labels {
            // Use a conditional insert to prevent duplicates
            sql:ExecutionResult|sql:Error result = database:Client->execute(`
            INSERT INTO UserPreferences (user_id, label)
            SELECT ${UserPreference.user_id}, ${label}
            WHERE NOT EXISTS (
                SELECT 1 FROM UserPreferences 
                WHERE user_id = ${UserPreference.user_id} AND label = ${label}
            )
        `);

            if (result is sql:Error) {
                log:printError("Error occurred while inserting user preference", 'error = result);
                return result;
            }
        }
        return ();
    }

    // Endpoint to insert user preferences
    resource function POST saveUserPreferences(http:Caller caller, http:Request req) returns error? {
        json|http:ClientError payload = req.getJsonPayload();
        if (payload is http:ClientError) {
            log:printError("Error while parsing request payload", 'error = payload);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        CreateUserPreference|error UserPreference = payload.cloneWithType(CreateUserPreference);
        if (UserPreference is error) {
            log:printError("Error while converting JSON to CreateUserPreference", 'error = UserPreference);
            check caller->respond(http:STATUS_BAD_REQUEST);
            return;
        }

        error? result = self.insertUserPreferences(UserPreference);
        if (result is error) {
            log:printError("Error occurred while inserting user preference", 'error = result);
            check caller->respond(http:STATUS_INTERNAL_SERVER_ERROR);
            return;
        }

        check caller->respond(http:STATUS_CREATED);
    }

}
