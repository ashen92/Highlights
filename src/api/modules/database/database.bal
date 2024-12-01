import ballerinax/mysql;

// configurable int port = ?;
// configurable string host = ?;
// configurable string user = ?;
// configurable string database = ?;
// configurable string password = ?;

public final mysql:Client Client = check new ("localhost", "root", "root", "highlights", 3306);
