import webapp.backend.http_listener;
import webapp.backend.database;
import ballerina/http;
import ballerina/sql;

type CalendarEvent record {| 
    int id; 
    string title; 
    string startTime; 
    string endTime; 
    string description = ""; 
    string eventSource = "highlights"; 
    string color = ""; 
    boolean allDay = false; 
    string reminder = ""; 
    string priority; 
    string label; 
    string status; 
    int tasklistId; 
    int userId; 
|};

type CreateEventPayload record {| 
    string title; 
    string startTime; 
    string endTime; 
    string description = ""; 
    string eventSource = "highlights"; 
    string color = ""; 
    boolean allDay = false; 
    string reminder = ""; 
    string priority; 
    string label; 
    string status; 
    int tasklistId; 
    int userId; 
|};

type UpdateEventPayload record {| 
    string startTime; 
    string endTime; 
    string title?; 
    string description?; 
    string color?; 
    boolean allDay?; 
    string reminder?; 
    string priority?; 
    string label?; 
    string status?; 
|};

configurable string azureAdIssuer = ?; 
configurable string azureAdAudience = ?; 
configurable string[] corsAllowOrigins = ?;

@http:ServiceConfig { 
    auth: [{ 
        jwtValidatorConfig: { 
            issuer: azureAdIssuer, 
            audience: azureAdAudience, 
            scopeKey: "scp" 
        }, 
        scopes: ["User.Read"] 
    }], 
    cors: { 
        allowOrigins: corsAllowOrigins, 
        allowCredentials: false, 
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
        allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"], 
        maxAge: 84900 
    } 
} 
service /calendar on http_listener:Listener {

    // Fetch events from database and external sources
    resource function get events() returns CalendarEvent[]|error { 
        sql:ParameterizedQuery sqlQuery = `
            SELECT 
                t.id, 
                t.title, 
                t.startTime, 
                t.endTime, 
                COALESCE(t.description, '') as description, 
                'highlights' as eventSource, 
                '' as color, 
                false as allDay, 
                COALESCE(t.reminder, '') as reminder,
                t.priority,
                t.label,
                t.status,
                t.tasklistId,
                t.userId 
            FROM Task t`;

        stream<CalendarEvent, sql:Error?> resultStream = database:Client->query(sqlQuery); 

        CalendarEvent[] eventList = []; 

        check from var event in resultStream do { 
            eventList.push(event); 
        };

        // Set default values for missing fields
        foreach var event in eventList {
            // Ensure allDay and color have default values
            event.allDay = event.allDay ? event.allDay : false;
            event.color = event.color != "" ? event.color : "#FFFFFF"; // default color white
            event.reminder = event.reminder != "" ? event.reminder : "none"; // default reminder
            // Adjust time formatting if necessary
            event.startTime = event.startTime != "" ? event.startTime : "1970-01-01T00:00:00Z"; // default start time
            event.endTime = event.endTime != "" ? event.endTime : "1970-01-01T00:00:00Z"; // default end time
        }

        // Retrieve events from external services
        CalendarEvent[] googleEvents = check self.getGoogleEvents(); 
        CalendarEvent[] microsoftEvents = check self.getMicrosoftTodoEvents(); 

        // Combine all events
        eventList.push(...googleEvents); 
        eventList.push(...microsoftEvents); 

        return eventList; 
    }


    function getGoogleEvents() returns CalendarEvent[]|error { 
        return []; 
    }

    function getMicrosoftTodoEvents() returns CalendarEvent[]|error { 
        return []; 
    } 
}
