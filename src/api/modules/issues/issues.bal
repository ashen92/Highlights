import webapp.backend.http_listener;
import webapp.backend.database;
import ballerina/http;
import ballerina/io;
import ballerina/log;
import ballerina/sql;
// import ballerinax/mysql.driver as _;

configurable string azureAdIssuer = ?;
configurable string azureAdAudience = ?;
configurable string[] corsAllowOriginsIssues = ?;

type IssueDetails record {
    int id;
    string title;
    string? description;
    int userId;  // Add this field for userId
    string? dueDate;
};


type IssueInput record {|
    string title;
    string? description;
    int userId;
|};



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
        allowOrigins: corsAllowOriginsIssues,
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
service /issues on http_listener:Listener {
    resource function post issues(http:Caller caller, http:Request req) returns error? {
    json|http:ClientError payload = req.getJsonPayload();
    io:println(payload);

    if payload is http:ClientError {
        log:printError("Error while parsing request payload", 'error = payload);
        check caller->respond(http:STATUS_BAD_REQUEST);
        return;
    }

    IssueInput|error issue = payload.cloneWithType(IssueInput);

    if issue is error {
        log:printError("Error while converting JSON to IssueInput", 'error = issue);
        check caller->respond(http:STATUS_BAD_REQUEST);
        return;
    }

    sql:ExecutionResult|sql:Error result = database:Client->execute(`
        INSERT INTO Issues (title, description, userId, dueDate) 
        VALUES (${issue.title}, ${issue.description}, ${issue.userId}, NOW());
    `);

    if result is sql:Error {
        log:printError("Error occurred while inserting issue", 'error = result);
        check caller->respond(http:STATUS_INTERNAL_SERVER_ERROR);
        return;
    }

    check caller->respond(http:STATUS_CREATED);
}


    
resource function get fetchIssues() returns IssueDetails[]|error {
    io:println("Fetching issues...");
    sql:ParameterizedQuery query = `SELECT * FROM Issues`;

    stream<IssueDetails, sql:Error?> resultStream = database:Client->query(query);
    
    IssueDetails[] issueDetails = [];
    error? e = resultStream.forEach(function(IssueDetails issue) {
        issueDetails.push(issue);
    });

    if e is error {
        log:printError("Error fetching issues", 'error = e);
        return e;
    }

    check resultStream.close();
    io:println(issueDetails);
    return issueDetails;
}


// Delete issue
resource function delete deleteIssue/[int issueId](http:Caller caller) returns error? {
    sql:ExecutionResult|sql:Error result = database:Client->execute(`
        DELETE FROM Issues WHERE id = ${issueId};
    `);

        if result is sql:Error {
            log:printError("Error occurred while deleting the issue", 'error = result);
            check caller->respond(http:STATUS_INTERNAL_SERVER_ERROR);
        } else {
            check caller->respond(http:STATUS_OK);
        }
    }

}

