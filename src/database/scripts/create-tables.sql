-- AUTO-GENERATED FILE.

-- This file is an auto-generated file by Ballerina persistence layer for model.
-- Please verify the generated scripts and execute them against the target DB server.

DROP TABLE IF EXISTS `PausePomodoro`;
DROP TABLE IF EXISTS `Pomodoro`;
DROP TABLE IF EXISTS `PauseStopwatch`;
DROP TABLE IF EXISTS `Stopwatch`;
DROP TABLE IF EXISTS `Highlight`;
DROP TABLE IF EXISTS `Task`;
DROP TABLE IF EXISTS `UserLinkedAccount`;
DROP TABLE IF EXISTS `Timer`;
DROP TABLE IF EXISTS `Issues`;
DROP TABLE IF EXISTS `TaskList`;
DROP TABLE IF EXISTS `UserPreferences`;
DROP TABLE IF EXISTS `FeatureUsageLogs`;
DROP TABLE IF EXISTS `DailyTip`;
DROP TABLE IF EXISTS `User`;
DROP TABLE IF EXISTS `Review`;
DROP TABLE IF EXISTS `LinkedAccount`;
DROP TABLE IF EXISTS `Project`;

CREATE TABLE `Project` (
	`id` INT AUTO_INCREMENT,
	`name` VARCHAR(191) NOT NULL,
	PRIMARY KEY(`id`)
);

CREATE TABLE `LinkedAccount` (
	`id` INT AUTO_INCREMENT,
	`name` VARCHAR(191) NOT NULL,
	PRIMARY KEY(`id`)
);

CREATE TABLE `Review` (
	`id` INT AUTO_INCREMENT,
	`description` VARCHAR(191) NOT NULL,
	PRIMARY KEY(`id`)
);

CREATE TABLE `User` (
	`id` INT AUTO_INCREMENT,
	`sub` VARCHAR(191) NOT NULL,
	`photo` LONGBLOB,
	PRIMARY KEY(`id`)
);

CREATE TABLE `DailyTip` (
	`id` INT AUTO_INCREMENT,
	`label` VARCHAR(191) NOT NULL,
	`tip` VARCHAR(191) NOT NULL,
	`rate` INT NOT NULL,
	`date` DATE NOT NULL,
	PRIMARY KEY(`id`)
);

CREATE TABLE `UserPreferences` (
	`id` INT AUTO_INCREMENT,
	`user_id` INT NOT NULL,
	`label` VARCHAR(191) NOT NULL,
	PRIMARY KEY(`id`)
);

CREATE TABLE `FeatureUsageLogs` (
	`id` INT AUTO_INCREMENT,
	`feature` VARCHAR(191) NOT NULL,
	`time` DATETIME NOT NULL,
	`userId` INT NOT NULL,
	FOREIGN KEY(`userId`) REFERENCES `User`(`id`),
	PRIMARY KEY(`id`)
);

CREATE TABLE `TaskList` (
	`id` INT AUTO_INCREMENT,
	`title` VARCHAR(191) NOT NULL,
	`createdAt` DATETIME NOT NULL,
	`userId` INT NOT NULL,
	FOREIGN KEY(`userId`) REFERENCES `User`(`id`),
	PRIMARY KEY(`id`)
);

CREATE TABLE `Issues` (
	`id` INT AUTO_INCREMENT,
	`title` VARCHAR(191) NOT NULL,
	`description` VARCHAR(191),
	`dueDate` DATETIME,
	`userId` INT NOT NULL,
	FOREIGN KEY(`userId`) REFERENCES `User`(`id`),
	PRIMARY KEY(`id`)
);

CREATE TABLE `Timer` (
	`id` INT AUTO_INCREMENT,
	`name` VARCHAR(191) NOT NULL,
	`pomoDuration` TIME NOT NULL,
	`shortBreakDuration` TIME NOT NULL,
	`longBreakDuration` TIME NOT NULL,
	`pomosPerLongBreak` INT NOT NULL,
	`userId` INT NOT NULL,
	FOREIGN KEY(`userId`) REFERENCES `User`(`id`),
	PRIMARY KEY(`id`)
);

CREATE TABLE `UserLinkedAccount` (
	`id` INT AUTO_INCREMENT,
	`email` VARCHAR(191),
	`userId` INT NOT NULL,
	FOREIGN KEY(`userId`) REFERENCES `User`(`id`),
	`linkedaccountId` INT NOT NULL,
	FOREIGN KEY(`linkedaccountId`) REFERENCES `LinkedAccount`(`id`),
	PRIMARY KEY(`id`)
);

CREATE TABLE `Task` (
	`id` INT AUTO_INCREMENT,
	`title` VARCHAR(191) NOT NULL,
	`description` VARCHAR(191),
	`dueDate` DATETIME,
	`startTime` DATETIME,
	`endTime` DATETIME,
	`reminder` VARCHAR(191),
	`priority` VARCHAR(191) NOT NULL,
	`label` VARCHAR(191) NOT NULL,
	`status` VARCHAR(191) NOT NULL,
	`completionTime` DATETIME,
	`userId` INT NOT NULL,
	FOREIGN KEY(`userId`) REFERENCES `User`(`id`),
	PRIMARY KEY(`id`)
);

CREATE TABLE `Highlight` (
	`id` INT AUTO_INCREMENT,
	`taskId` INT NOT NULL,
	FOREIGN KEY(`taskId`) REFERENCES `Task`(`id`),
	PRIMARY KEY(`id`)
);

CREATE TABLE `Stopwatch` (
	`id` INT AUTO_INCREMENT,
	`startTime` DATETIME NOT NULL,
	`endTime` DATETIME,
	`status` VARCHAR(191) NOT NULL,
	`timerId` INT NOT NULL,
	FOREIGN KEY(`timerId`) REFERENCES `Timer`(`id`),
	`highlightId` INT NOT NULL,
	FOREIGN KEY(`highlightId`) REFERENCES `Task`(`id`),
	`userId` INT NOT NULL,
	FOREIGN KEY(`userId`) REFERENCES `User`(`id`),
	PRIMARY KEY(`id`)
);

CREATE TABLE `PauseStopwatch` (
	`id` INT AUTO_INCREMENT,
	`pauseTime` DATETIME NOT NULL,
	`continueTime` DATETIME,
	`stopwatchId` INT NOT NULL,
	FOREIGN KEY(`stopwatchId`) REFERENCES `Stopwatch`(`id`),
	`highlightId` INT NOT NULL,
	FOREIGN KEY(`highlightId`) REFERENCES `Task`(`id`),
	PRIMARY KEY(`id`)
);

CREATE TABLE `Pomodoro` (
	`id` INT AUTO_INCREMENT,
	`startTime` DATETIME NOT NULL,
	`endTime` DATETIME,
	`status` VARCHAR(191) NOT NULL,
	`timerId` INT NOT NULL,
	FOREIGN KEY(`timerId`) REFERENCES `Timer`(`id`),
	`highlightId` INT NOT NULL,
	FOREIGN KEY(`highlightId`) REFERENCES `Task`(`id`),
	`userId` INT NOT NULL,
	FOREIGN KEY(`userId`) REFERENCES `User`(`id`),
	PRIMARY KEY(`id`)
);

CREATE TABLE `PausePomodoro` (
	`id` INT AUTO_INCREMENT,
	`pauseTime` DATETIME NOT NULL,
	`continueTime` DATETIME,
	`highlightId` INT NOT NULL,
	FOREIGN KEY(`highlightId`) REFERENCES `Task`(`id`),
	`pomodoroId` INT NOT NULL,
	FOREIGN KEY(`pomodoroId`) REFERENCES `Pomodoro`(`id`),
	PRIMARY KEY(`id`)
);

CREATE TABLE `projects` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `projectName` VARCHAR(255) NOT NULL,
    `progress` VARCHAR(255),
    `startDate` DATE,
    `dueDate` DATE,
    `priority` VARCHAR(255),
    `percentage` INT,
	`email` VARCHAR(255) NOT NULL
);
CREATE TABLE `taskss` (
    `taskId` INT AUTO_INCREMENT PRIMARY KEY,
    `taskName` VARCHAR(255) NOT NULL,
    `progress` VARCHAR(255),
    `startDate` DATE,
    `dueDate` DATE,
    `priority` VARCHAR(255),
    `percentage` INT,
	`projectId` INT
);
CREATE TABLE `assignees` (
    `taskId` INT NOT NULL,
    `assignee` VARCHAR(255) NOT NULL,
	`userId` INT NOT NULL,
    PRIMARY KEY (taskId, assignee)
);


