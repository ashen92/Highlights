import webapp.backend.http_listener;
import webapp.backend.storage;

import ballerina/http;
import ballerina/time;

type TaskListInsert record {|
    string title;
    int userId;
    string createdAt;
|};

type TaskListUpdate record {|
    string title;
|};

service /lists on http_listener:Listener {
    private final storage:Client sClient;

    function init() returns error? {
        self.sClient = check new ();
    }

    resource function get .(int uid) returns storage:TaskList[]|error {
        storage:User user = check self.sClient->/users/[uid];
        stream<storage:TaskList, error?> taskListStream = self.sClient->/tasklists;
        return from storage:TaskList taskList in taskListStream
            where taskList.userId == user.id
            select taskList;
    }

    resource function post .(@http:Payload TaskListInsert taskListInsert) returns storage:TaskList|error {
        storage:TaskListInsert taskList = {
            title: taskListInsert.title,
            userId: taskListInsert.userId,
            createdAt: check time:civilFromString(taskListInsert.createdAt)
        };

        int[] taskListId = check self.sClient->/tasklists.post([taskList]);
        return check self.sClient->/tasklists/[taskListId[0]];
    }

    resource function patch [int id](@http:Payload TaskListUpdate taskList) returns storage:TaskList|error {
        return check self.sClient->/tasklists/[id].put(taskList);
    }

    resource function delete [int id]() returns storage:TaskList|error {
        return self.sClient->/tasklists/[id].delete();
    }
}
