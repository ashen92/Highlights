import webapp.backend.http_listener;
import webapp.backend.storage;

import ballerina/http;
import ballerina/log;

service /users on http_listener:Listener {
    private final storage:Client sClient;

    function init() returns error? {
        self.sClient = check new ();
    }

    resource function get [int id]() returns storage:User|error {
        return self.sClient->/users/[id]();
    }

    resource function post .(@http:Payload storage:UserInsert user) returns http:Created|http:Conflict|http:InternalServerError|error {
        do {
            stream<storage:User, error?> users = self.sClient->/users();
            storage:User[] existingUser = check from var u in users
                where u.sub == user.sub
                select u;

            if existingUser.length() == 0 {
                do {
                    _ = check self.sClient->/users.post([user]);
                    return http:CREATED;
                } on fail var e {
                    log:printError("Error occurred while inserting data: ", e);
                    return http:INTERNAL_SERVER_ERROR;
                }
            } else {
                return http:CONFLICT;
            }
        } on fail var e {
            log:printError("Error occurred: ", e);
            return http:INTERNAL_SERVER_ERROR;
        }
    }
}
