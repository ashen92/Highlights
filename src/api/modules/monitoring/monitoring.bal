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

// Allowed table names
map<string> allowedTables = {
    "DailyTip": "DailyTip",
    "Highlight": "Highlight",
    "Pomodoro": "Pomodoro",
    "Project": "Project",
    "Issues": "Issues"
};

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

        // Map of features to table names
        map<string> queries = {
            "Daily Tips": "DailyTip",
            "Highlights": "Highlight",
            "Pomodoro": "Pomodoro",
            "Projects": "Project",
            "Issues": "Issues"
        };

        // Iterate over each feature and fetch its count
        foreach var [feature, tableName] in queries.entries() {
            // Validate table name to prevent SQL injection
            if (!allowedTables.hasKey(tableName)) {
                log:printError(string `Invalid table name: ${tableName}`);
                return "error";
            }

            // Fetch the count for each table separately
            int|error number = self.getFeatureCount(tableName);  
            if (number is error) {
                log:printError(string `Error fetching number for feature: ${feature}`, 'error = number);
                return "error";
            }

            // Add feature and count to the usageMetrics array
            usageMetrics.push({
                feature: feature,
                number: number  
            });
        }

        // Log the usageMetrics array to print it
        log:printInfo("Feature Usage Metrics: " + usageMetrics.toString());

        // Return the usageMetrics array
        return usageMetrics;
    }

    // Helper function to execute a query and retrieve the number
    private function getFeatureCount(string tableName) returns error|int {
        // Construct the SQL query string using ParameterizedQuery
        sql:ParameterizedQuery query = `SELECT COUNT(*) AS count FROM DailyTip`;

        // Log the query for debugging
        log:printInfo(string `Executing query for table: ${tableName}`);

        // Execute the query
        stream<record {| int count; |}, sql:Error?> resultStream = database:Client->query(query);

        // Fetch the first result from the stream
        record {| record {| int count; |} value; |}? result = check resultStream.next();
        check resultStream.close();

        if result is record {| record {| int count; |} value; |} {
            return result.value.count; 
        }

        return error("Failed to fetch number");
    }
}
