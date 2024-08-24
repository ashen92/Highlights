-- AUTO-GENERATED FILE.

-- This file is an auto-generated file by Ballerina persistence layer for model.
-- Please verify the generated scripts and execute them against the target DB server.

DROP TABLE IF EXISTS `PausePomodoro`;
DROP TABLE IF EXISTS `Pomodoro`;
DROP TABLE IF EXISTS `Stopwatch`;
DROP TABLE IF EXISTS `Highlight`;
DROP TABLE IF EXISTS `Task`;
DROP TABLE IF EXISTS `Timer`;
DROP TABLE IF EXISTS `TaskList`;
DROP TABLE IF EXISTS `PauseStopwatch`;
DROP TABLE IF EXISTS `Project`;
DROP TABLE IF EXISTS `DailyTip`;
DROP TABLE IF EXISTS `User`;
DROP TABLE IF EXISTS `Review`;

CREATE TABLE `Review` (
	`id` INT AUTO_INCREMENT,
	`description` VARCHAR(191) NOT NULL,
	PRIMARY KEY(`id`)
);

CREATE TABLE `User` (
	`id` INT AUTO_INCREMENT,
	`sub` VARCHAR(191) NOT NULL,
	PRIMARY KEY(`id`)
);

CREATE TABLE `DailyTip` (
	`id` INT AUTO_INCREMENT,
	`label` VARCHAR(191) NOT NULL,
	`tip` VARCHAR(191) NOT NULL,
	PRIMARY KEY(`id`)
);

CREATE TABLE `Project` (
	`id` INT AUTO_INCREMENT,
	`name` VARCHAR(191) NOT NULL,
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

CREATE TABLE `Timer` (
	`id` INT AUTO_INCREMENT,
	`name` VARCHAR(191) NOT NULL,
	`pomoDuration` DATETIME NOT NULL,
	`shortBreakDuration` DATETIME NOT NULL,
	`longBreakDuration` DATETIME NOT NULL,
	`pomosPerLongBreak` INT NOT NULL,
	`userId` INT NOT NULL,
	FOREIGN KEY(`userId`) REFERENCES `User`(`id`),
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
	`tasklistId` INT NOT NULL,
	FOREIGN KEY(`tasklistId`) REFERENCES `TaskList`(`id`),
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
	`endTime` DATETIME NOT NULL,
	`status` VARCHAR(191) NOT NULL,
	`timerId` INT UNIQUE NOT NULL,
	FOREIGN KEY(`timerId`) REFERENCES `Timer`(`id`),
	`highlightId` INT NOT NULL,
	FOREIGN KEY(`highlightId`) REFERENCES `Highlight`(`id`),
	PRIMARY KEY(`id`)
);

CREATE TABLE `PauseStopwatch` (
	`id` INT AUTO_INCREMENT,
	`pauseTime` DATETIME NOT NULL,
	`continueTime` DATETIME NOT NULL,
	`stopwatchId` INT UNIQUE NOT NULL,
	FOREIGN KEY(`stopwatchId`) REFERENCES `Stopwatch`(`id`),
	PRIMARY KEY(`id`)
);

CREATE TABLE `Pomodoro` (
	`id` INT AUTO_INCREMENT,
	`startTime` DATETIME NOT NULL,
	`endTime` DATETIME NOT NULL,
	`status` VARCHAR(191) NOT NULL,
	`timerId` INT UNIQUE NOT NULL,
	FOREIGN KEY(`timerId`) REFERENCES `Timer`(`id`),
	`highlightId` INT NOT NULL,
	FOREIGN KEY(`highlightId`) REFERENCES `Highlight`(`id`),
	PRIMARY KEY(`id`)
);

CREATE TABLE `PausePomodoro` (
	`id` INT AUTO_INCREMENT,
	`pauseTime` DATETIME NOT NULL,
	`continueTime` DATETIME NOT NULL,
	`pomodoroId` INT UNIQUE NOT NULL,
	FOREIGN KEY(`pomodoroId`) REFERENCES `Pomodoro`(`id`),
	PRIMARY KEY(`id`)
);


