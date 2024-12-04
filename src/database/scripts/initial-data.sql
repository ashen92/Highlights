insert into User(sub) values('88grQ5jEIi3oZPACUKVKC7EUxmeJIAMM7e8h9Yoi4ZM');

insert into LinkedAccount(name) values('Microsoft'), ('Google');

INSERT INTO `Task` (
    `id`, `title`, `description`, `dueDate`, `startTime`, `endTime`,
    `reminder`, `priority`, `label`, `status`, `userId`
) VALUES
(1, 'Read Gamperaliya', 'reading', '2024-12-02 00:00:00', '2024-12-02 13:21:00', '2024-12-02 14:21:00', 'Before 10 minutes', 'high', 'Reading', 'pending', 1),
(2, 'Write a novel', 'writing', '2024-12-03 00:00:00', '2024-12-03 14:22:00', '2024-12-03 15:22:00', 'Before 15 minutes', 'low', 'Writing', 'pending', 1),
(3, 'Preparing the presentation', 'Homework', '2024-12-05 00:00:00', '2024-12-05 14:23:00', '2024-12-05 16:23:00', 'Before 15 minutes', 'medium', 'Shopping', 'pending', 1),
(4, 'Homework', 'jad', '2024-12-10 00:00:00', '2024-12-10 15:24:00', '2024-12-10 16:24:00', 'Before 15 minutes', 'none', 'Homework', 'pending', 1),
(5, 'Morning Team Meeting', 'Daily standup with development team', '2024-12-03 00:00:00', '2024-12-03 09:00:00', '2024-12-03 10:00:00', 'Before 15 minutes', 'high', 'Meeting', 'pending', 1),
(6, 'Review Project Documentation', 'Review and update sprint documentation', '2024-12-03 00:00:00', '2024-12-03 10:30:00', '2024-12-03 11:30:00', 'Before 10 minutes', 'medium', 'Documentation', 'pending', 1),
(7, 'Client Presentation', 'Present quarterly results', '2024-12-03 00:00:00', '2024-12-03 14:00:00', '2024-12-03 15:30:00', 'Before 20 minutes', 'high', 'Meeting', 'pending', 1),
(8, 'Code Review Session', 'Review pull requests for new features', '2024-12-03 00:00:00', '2024-12-03 16:00:00', '2024-12-03 17:00:00', 'Before 15 minutes', 'medium', 'Development', 'pending', 1),
(9, 'System Testing', 'Complete system testing for release', '2024-12-03 00:00:00', '2024-12-03 11:00:00', '2024-12-03 12:00:00', 'Before 10 minutes', 'high', 'Testing', 'completed', 1),
(10, 'Database Optimization', 'Optimize database queries', '2024-12-03 00:00:00', '2024-12-03 13:00:00', '2024-12-03 14:00:00', 'Before 15 minutes', 'medium', 'Development', 'completed', 1);


INSERT INTO `Timer` (name, pomoDuration, shortBreakDuration, longBreakDuration, pomosPerLongBreak, userId)
VALUES
('Morning Focus', '00:25:00', '00:05:00', '00:15:00', 4, 1),
('Afternoon Session', '00:30:00', '00:10:00', '00:20:00', 3, 1),
('Evening Study', '00:45:00', '00:10:00', '00:25:00', 5, 1),
('Night Work', '01:00:00', '00:15:00', '00:30:00', 2, 1),
('Weekend Marathon', '02:00:00', '00:20:00', '00:45:00', 6, 1);

INSERT INTO `Highlight` (taskId)
VALUES
(1),
(2),
(3),
(4);

INSERT INTO `Pomodoro` (
    `id`, `startTime`, `endTime`, `status`, `timerId`, `highlightId`, `userId`
) VALUES
(1, '2024-12-02 15:04:55', '2024-12-02 15:05:09', 'complete', 1, 2, 1),
(2, '2024-12-02 15:10:32', '2024-12-02 15:10:38', 'uncomplete', 1, 3, 1);

INSERT INTO `PausePomodoro` (
    `id`, `pauseTime`, `continueTime`, `highlightId`, `pomodoroId`
) VALUES
(1, '2024-12-02 15:05:00', '2024-12-02 15:05:02', 2, 1),
(2, '2024-12-02 15:10:35', NULL, 3, 2);

INSERT INTO `projects`
(`projectName`, `progress`, `startDate`, `dueDate`, `priority`, `percentage`, `email`)
VALUES
('project 1', 'in_progress', '2024-10-30', '2024-12-25', 'low', 54, 'ashenhasanka12@gmail.com'),
('project 2', 'in_progress', '2024-11-30', '2024-12-15', 'high', 74, 'ashenhasanka12@gmail.com');

INSERT INTO taskss
(`taskName`,`progress`,`startDate`,`dueDate`,`priority`,`percentage`,`projectId`)
VALUES
('task 1','in_progress','2024-11-30','2024-12-25','low',54,1),
('task 2','in_progress','2024-10-30','2024-12-15','low',74,1),
('task 3','in_progress','2024-11-30','2024-12-25','low',44,1);

INSERT INTO assignees
(`taskId`,`assignee`,`userId`)
VALUES
(1,'ashenhasanka12@gmail.com',1),
(2,'ashenhasanka12@gmail.com',1);

INSERT INTO `Stopwatch` (`id`, `startTime`, `endTime`, `status`, `timerId`, `highlightId`, `userId`) VALUES
(1, '2024-08-02 10:00:00', '2024-08-02 10:30:00', 'complete', 1, 1, 1),
(2, '2024-08-05 15:00:00', '2024-08-05 15:45:00', 'uncomplete', 1, 2, 1),
(3, '2024-08-10 14:30:00', '2024-08-10 15:00:00', 'complete', 1, 3, 1);
