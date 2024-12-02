import webapp.backend.database;
import ballerina/http;
import ballerina/log;
import ballerina/sql;

configurable string azureAdIssuer = ?;
configurable string azureAdAudience = ?;
configurable string[] corsAllowOrigins = ?;

type FeatureUsage record {
    string feature;
    int number;  
};

listener http:Listener monitoringListener = new(9090);

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

service /monitoring on monitoringListener {

    // Endpoint to retrieve feature usage metrics
    resource function get featureUsage(http:Request req) returns error?|FeatureUsage[]|string {
        FeatureUsage[] usageMetrics = [];

        // Fetch count for each table separately
        int|error dailyTipCount = self.getDailyTipCount();
        if (dailyTipCount is error) {
            return "Error fetching DailyTip count";
        }
        usageMetrics.push({feature: "Daily Tips", number: dailyTipCount});

        int|error highlightCount = self.getHighlightCount();
        if (highlightCount is error) {
            return "Error fetching Highlight count";
        }
        usageMetrics.push({feature: "Highlights", number: highlightCount});

        int|error pomodoroCount = self.getPomodoroCount();
        if (pomodoroCount is error) {
            return "Error fetching Pomodoro count";
        }
        usageMetrics.push({feature: "Pomodoro", number: pomodoroCount});

        int|error projectCount = self.getProjectCount();
        if (projectCount is error) {
            return "Error fetching Project count";
        }
        usageMetrics.push({feature: "Projects", number: projectCount});

        int|error issuesCount = self.getIssuesCount();
        if (issuesCount is error) {
            return "Error fetching Issues count";
        }
        usageMetrics.push({feature: "Issues", number: issuesCount});

        // Log the usageMetrics array to print it
        log:printInfo("Feature Usage Metrics: " + usageMetrics.toString());

        // Return the usageMetrics array
        return usageMetrics;
    }

    // Fetch count for DailyTip table
    private function getDailyTipCount() returns error|int {
        sql:ParameterizedQuery query = `SELECT COUNT(*) AS count FROM DailyTip`;
        log:printInfo("Executing query for DailyTip");

        stream<record {| int count; |}, sql:Error?> resultStream = database:Client->query(query);
        record {| record {| int count; |} value; |}? result = check resultStream.next();
        check resultStream.close();

        if result is record {| record {| int count; |} value; |} {
            return result.value.count;
        }

        return error("Failed to fetch number for DailyTip");
    }

    // Fetch count for Highlight table
    private function getHighlightCount() returns error|int {
        sql:ParameterizedQuery query = `SELECT COUNT(*) AS count FROM Highlight`;
        log:printInfo("Executing query for Highlight");

        stream<record {| int count; |}, sql:Error?> resultStream = database:Client->query(query);
        record {| record {| int count; |} value; |}? result = check resultStream.next();
        check resultStream.close();

        if result is record {| record {| int count; |} value; |} {
            return result.value.count;
        }

        return error("Failed to fetch number for Highlight");
    }

    // Fetch count for Pomodoro table
    private function getPomodoroCount() returns error|int {
        sql:ParameterizedQuery query = `SELECT COUNT(*) AS count FROM Pomodoro`;
        log:printInfo("Executing query for Pomodoro");

        stream<record {| int count; |}, sql:Error?> resultStream = database:Client->query(query);
        record {| record {| int count; |} value; |}? result = check resultStream.next();
        check resultStream.close();

        if result is record {| record {| int count; |} value; |} {
            return result.value.count;
        }

        return error("Failed to fetch number for Pomodoro");
    }

    // Fetch count for Project table
    private function getProjectCount() returns error|int {
        sql:ParameterizedQuery query = `SELECT COUNT(*) AS count FROM Project`;
        log:printInfo("Executing query for Project");

        stream<record {| int count; |}, sql:Error?> resultStream = database:Client->query(query);
        record {| record {| int count; |} value; |}? result = check resultStream.next();
        check resultStream.close();

        if result is record {| record {| int count; |} value; |} {
            return result.value.count;
        }

        return error("Failed to fetch number for Project");
    }

    // Fetch count for Issues table
    private function getIssuesCount() returns error|int {
        sql:ParameterizedQuery query = `SELECT COUNT(*) AS count FROM Issues`;
        log:printInfo("Executing query for Issues");

        stream<record {| int count; |}, sql:Error?> resultStream = database:Client->query(query);
        record {| record {| int count; |} value; |}? result = check resultStream.next();
        check resultStream.close();

        if result is record {| record {| int count; |} value; |} {
            return result.value.count;
        }

        return error("Failed to fetch number for Issues");
    }
}
