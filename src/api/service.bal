import ballerina/http;
import ballerina/log;
import ballerina/sql;
import ballerina/time;
import ballerinax/mysql;
import ballerinax/mysql.driver as _;

type Greeting record {|
    string greeting;
|};

type CreateUser record {|
    string sub;
|};

type User record {|
    int id;
    string sub;
|};

type Task record {|
    string? id = null;
    string title;
    time:Utc? dueDate = null;
|};

type Highlight record {|
    string? id = null;
    string title;
    time:Utc? dueDate = null;
|};

type TimerDetails record {|
    string? id = null;
    string title;
    time:Utc? dueDate = null;
|};

Task[] tasks = [
    {id: "1", title: "Task 1"},
    {id: "2", title: "Task 2"},
    {id: "3", title: "Task 3"}
];


Highlight[] highlights = [
    {id: "1", title: "Learning Ballerina"},
    {id: "2", title: "React Project"},
    {id: "3", title: "Exercise"}
];

TimerDetails[] timer_details = [
    {id: "1", title: "First Timer"},
    {id: "2", title: "Second Timer"},
    {id: "3", title: "Third Timer"}
];

// listener http:Listener securedEP = new (9090);

// Define the configuration variables
configurable string azureAdIssuer = ?;
configurable string azureAdAudience = ?;

@http:ServiceConfig {
    // auth: [
    //     {
    //         jwtValidatorConfig: {
    //             issuer: azureAdIssuer,
    //             audience: azureAdAudience,
    //             scopeKey: "scp"
    //         },
    //         scopes: ["User.Read"]
    //     }
    // ],
    cors: {
        allowOrigins: ["http://localhost:3000"],
        allowCredentials: false,
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
        maxAge: 84900
    }
}
service / on new http:Listener(9090) {

    resource function get greeting(string? name) returns Greeting {
        string greetingStr = string `Hello, ${name == () ? "visitor" : name}!`;
        Greeting greeting = {greeting: greetingStr};
        return greeting;
    }

    private final mysql:Client db;

    function init() returns error? {
        // Initiate the mysql client at the start of the service. This will be used
        // throughout the lifetime of the service.
        self.db = check new ("localhost", "root", "root", "highlights", 3306);
    }

    resource function post users(CreateUser createUser) returns http:Created|http:Conflict|http:InternalServerError {

        User|sql:Error result = self.db->queryRow(`SELECT * FROM users WHERE sub = ${createUser.sub}`);

        if result is sql:NoRowsError {
            do {
                _ = check self.db->execute(`
                        INSERT INTO users (sub)
                        VALUES (${createUser.sub});`);
            } on fail var e {
                log:printError("Error occurred while inserting data: ", e);
                return http:INTERNAL_SERVER_ERROR;
            }

            return http:CREATED;
        }

        if result is User {
            return http:CONFLICT;
        }

        return http:INTERNAL_SERVER_ERROR;
    }

    resource function get tasks() returns Task[] {
        return tasks;
    }

    resource function post tasks(Task task) returns Task {
        tasks.push({id: (tasks.length() + 1).toString(), title: task.title});
        log:printInfo("Task added");
        return task;
    }

    
    resource function get highlights() returns Highlight[] {
        return highlights;
    }

        resource function post highlights(Highlight highlight) returns Highlight {
        highlights.push({id: (highlights.length() + 1).toString(), title: highlight.title});
        log:printInfo("Highlight added");
        return highlight;
    }



    resource function get timer_details() returns TimerDetails[] {
        return timer_details;
    }



}

