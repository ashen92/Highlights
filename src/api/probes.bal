import ballerina/http;

listener http:Listener probeEP = new (9092);

service /probes on probeEP {
    resource function get healthz() returns boolean {
        return true;
    }

    resource function get readyz() returns boolean {
        return true;
    }
}
