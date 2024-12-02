insert into User(sub) values('88grQ5jEIi3oZPACUKVKC7EUxmeJIAMM7e8h9Yoi4ZM');

insert into LinkedAccount(name) values('Microsoft'), ('Google');

INSERT INTO `Task`
(`title`, `description`, `dueDate`, `startTime`, `endTime`, `reminder`, `priority`, `label`, `status`, `userId`)
VALUES
('Buy Groceries', 'Purchase items for the week', '2024-12-02 12:00:00', '2024-12-02 10:00:00', '2024-12-02 11:00:00', '2024-12-02 09:00:00', 'High', 'Personal', 'Pending', 1),
('Complete Project Report', 'Finalize the annual report', '2024-12-10 17:00:00', '2024-12-10 09:00:00', '2024-12-10 16:00:00', '2024-12-10 08:00:00', 'Medium', 'Work', 'In Progress', 1),
('Plan Vacation', 'Organize the upcoming trip', '2024-12-15 10:00:00', '2024-12-14 15:00:00', '2024-12-14 17:00:00', NULL, 'Low', 'Travel', 'Pending', 1),
('Prepare Presentation', 'Slides for Monday meeting', '2024-12-03 09:00:00', '2024-12-02 20:00:00', '2024-12-02 22:00:00', '2024-12-02 19:00:00', 'High', 'Work', 'Completed', 1),
('Book Doctor Appointment', 'Routine check-up', '2024-12-09 09:00:00', NULL, NULL, '2024-12-08 10:00:00', 'Medium', 'Personal', 'Pending', 1),
('Attend Workshop', 'AI and Machine Learning Workshop', '2024-12-12 10:00:00', '2024-12-12 09:00:00', '2024-12-12 15:00:00', '2024-12-11 12:00:00', 'High', 'Work', 'Upcoming', 1),
('Family Dinner', 'Dinner with family at home', '2024-12-02 19:00:00', '2024-12-02 18:00:00', '2024-12-02 21:00:00', '2024-12-02 17:00:00', 'Low', 'Personal', 'Pending', 1),
('Team Meeting', 'Monthly team status meeting', '2024-12-15 11:00:00', '2024-12-15 10:30:00', '2024-12-15 12:00:00', '2024-12-15 09:30:00', 'Medium', 'Work', 'Scheduled', 1),
('Renew Passport', 'Complete the renewal process online', '2024-12-20 14:00:00', NULL, NULL, '2024-12-19 10:00:00', 'High', 'Personal', 'Pending', 1),
('Visit the Dentist', 'Quarterly dental check-up', '2024-12-18 09:00:00', '2024-12-18 08:30:00', '2024-12-18 09:30:00', '2024-12-17 12:00:00', 'Medium', 'Personal', 'Upcoming', 1);
