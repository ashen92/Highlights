import React, { useState } from 'react';
import styles from './Calendar.module.css';
import { IconChevronDown } from '@tabler/icons-react';

// Mock task data
const tasks = [
  { id: 1, title: 'Task 1', date: new Date(2024, 0, 4), description: 'Description for task 1' },
  { id: 2, title: 'Task 2', date: new Date(2024, 0, 12), description: 'Description for task 2' },
  { id: 3, title: 'Task 3', date: new Date(2024, 0, 19), description: 'Description for task 3' },
  { id: 4, title: 'Task 4', date: new Date(2024, 1, 4), description: 'Description for task 4' },
  { id: 5, title: 'Task 5', date: new Date(2024, 1, 19), description: 'Description for task 5' },
];

const Calendar: React.FC = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [view, setView] = useState<'month' | 'year' | 'day' | 'week'>('month');

  const daysInMonth = (month: number, year: number): number => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number, year: number): number => new Date(year, month, 1).getDay();

  const handleDateClick = (day: number, month: number, year: number): void => {
    setSelectedDate(new Date(year, month, day));
  };

  const handlePrevious = (): void => {
    if (view === 'day') {
      // Create a new date object based on selectedDate and decrease by one day
      const newDate = new Date(selectedDate);
      newDate.setDate(selectedDate.getDate() - 1);
      setSelectedDate(newDate);

    } else if (view === 'week') {
      setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 7))); // Go to the previous week
      
    } else if (view === 'month') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else if (view === 'year') {
      setCurrentYear(currentYear - 1);
    }
  };
  

  const handleNext = (): void => {
    if (view === 'day') {
      // Create a new date object based on selectedDate and decrease by one day
      const newDate = new Date(selectedDate);
      newDate.setDate(selectedDate.getDate() + 1);
      setSelectedDate(newDate);
    } else if (view === 'week') {
      setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 7))); // Go to the next week
    } else if (view === 'month') {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    } else if (view === 'year') {
      setCurrentYear(currentYear + 1);
    }
  };

  const handleViewChange = (newView: 'month' | 'year' | 'day' | 'week'): void => {
    setView(newView);
  };

  // Get tasks for a specific date
  const tasksForDate = (date: Date): JSX.Element[] => {
    return tasks
      .filter(task => task.date.toDateString() === date.toDateString())
      .map(task => (
        <div key={task.id} className={styles.task}>
          <h4>{task.title}</h4>
          <p>{task.description}</p>
        </div>
      ));
  };

  const renderDayView = (): JSX.Element => {
    const tasksForDay = tasksForDate(selectedDate);
    return (
      <div className={styles.dayView}>
        <h3>{selectedDate.toDateString()}</h3>
        {tasksForDay.length === 0 ? <p>No tasks for this day</p> : tasksForDay}
      </div>
    );
  };


  const renderWeekView = (): JSX.Element => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay()); // Set to the start of the week (Sunday)
    
    // Generate week days array with only day numbers for headers
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  
    // Define time slots
    const timeSlots = Array.from({ length: 24 }, (_, i) => `${i + 0}:00 - ${i + 1}:00`); // 8 AM to 8 PM slots
    
    return (
      <div className={styles.weekView}>
        <table className={styles.weekTable}>
          <thead>
            <tr>
              <th>Time</th>
              {weekDays.map(day => (
                <th key={day.toDateString()}>{day.getDate()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot, slotIndex) => (
              <tr key={slot}>
                <td>{slot}</td>
                {weekDays.map((day, dayIndex) => (
                  <td key={`${dayIndex}-${slotIndex}`} className={styles.weekCell}>
                    <div className={styles.tasks}>
                      {tasks
                        .filter(task => 
                          task.date.getDate() === day.getDate() &&
                          task.date.getMonth() === day.getMonth() &&
                          task.date.getFullYear() === day.getFullYear()
                        )
                        .map(task => (
                          <div key={task.id} className={styles.task}>
                            {task.title}
                          </div>
                        ))}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  

  

  const renderMonth = (month: number, year: number): JSX.Element => {
    const totalDays = daysInMonth(month, year);
    const firstDay = firstDayOfMonth(month, year);
    const days = Array.from({ length: totalDays }, (_, i) => i + 1);
    const emptyCells = Array.from({ length: firstDay }, (_, i) => <div key={`empty-${i}`} className={styles.empty}></div>);

    return (
      <div className={styles.month} key={`${month}-${year}`}>
        <div className={styles.monthTitle}>{`${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`}</div>
        <div className={styles.daysOfWeek}>
          <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
        </div>
        <div className={styles.days}>
          {emptyCells}
          {days.map(day => (
            <div
              key={day}
              className={`${styles.day} ${selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year ? styles.selectedDay : ''}`}
              onClick={() => handleDateClick(day, month, year)}
            >
              <span>{day}</span>
              <div className={styles.tasks}>
                {tasks.filter(task => task.date.getDate() === day && task.date.getMonth() === month && task.date.getFullYear() === year)
                  .map(task => <div key={task.id} className={styles.taskPreview}>{task.title}</div>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderYearView = (): JSX.Element => {
    const months = Array.from({ length: 12 }, (_, i) => i);
    return (
      <div className={styles.year}>
        {months.map(month => renderMonth(month, currentYear))}
      </div>
    );
  };

  return (
    <div className={styles.calendarContainer}>
      <h2 className={styles.title}>Calendar view</h2>
      <div className={styles.header}>
        <div className={styles.viewToggle}>
          <button onClick={handlePrevious}>&lt;</button>
          <span>
            {view === 'day' 
              ? selectedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
              : view === 'month'
              ? `${new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} ${currentYear}`
              : view === 'week'
              ? `Week of ${selectedDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}`
              : currentYear
            }
          </span>
          <button onClick={handleNext}>&gt;</button>
        </div>
        <div className={styles.dropdown}>
          <button className={styles.dropbtn}>{view === 'month' ? 'Month' : view === 'day' ? 'Day' : view === 'week' ? 'Week' : 'Year'} <IconChevronDown size="1rem" /></button>
          <div className={styles.dropdownContent}>
          <a onClick={() => handleViewChange('day')}>Day</a>
          <a onClick={() => handleViewChange('week')}>Week</a>
            <a onClick={() => handleViewChange('month')}>Month</a>
            <a onClick={() => handleViewChange('year')}>Year</a>
          </div>
        </div>
      </div>
      <div className={styles.viewContainer}>
        {view === 'month' && renderMonth(currentMonth, currentYear)}
        {view === 'year' && renderYearView()}
        {view === 'day' && renderDayView()}
        {view === 'week' && renderWeekView()}
      </div>
    </div>
  );
};

export default Calendar;
