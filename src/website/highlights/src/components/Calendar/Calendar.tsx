import React, { useState } from 'react';
import styles from './Calendar.module.css';
import { IconChevronDown } from '@tabler/icons-react';

const Calendar: React.FC = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [view, setView] = useState<'month' | 'year'>('month');

  const daysInMonth = (month: number, year: number): number => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number, year: number): number => new Date(year, month, 1).getDay();

  const handleDateClick = (day: number, month: number, year: number): void => {
    setSelectedDate(new Date(year, month, day));
  };

  const handlePreviousMonth = (): void => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = (): void => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handlePreviousYear = (): void => {
    setCurrentYear(currentYear - 1);
  };

  const handleNextYear = (): void => {
    setCurrentYear(currentYear + 1);
  };

  const renderDays = (month: number, year: number, isYearView: boolean = false): JSX.Element[] => {
    const totalDays = daysInMonth(month, year);
    const firstDay = firstDayOfMonth(month, year);
    const days = Array.from({ length: totalDays }, (_, i) => i + 1);
    const emptyCells = Array.from({ length: firstDay }, (_, i) => <div key={`empty-${i}`} className={styles.empty}></div>);

    const patternDays = [
      { day: 4, month: 0, year: 2024, patterns: [styles.redPattern, styles.yellowPattern, styles.bluePattern] }, // January
      { day: 12, month: 0, year: 2024, patterns: [styles.redPattern, styles.yellowPattern] },
      { day: 19, month: 0, year: 2024, patterns: [styles.bluePattern, styles.redPattern] },
      { day: 4, month: 1, year: 2024, patterns: [styles.redPattern, styles.yellowPattern, styles.bluePattern] }, // February
      { day: 12, month: 1, year: 2024, patterns: [styles.redPattern, styles.yellowPattern] },
      { day: 19, month: 1, year: 2024, patterns: [styles.bluePattern, styles.redPattern] },
      { day: 4, month: 2, year: 2024, patterns: [styles.redPattern, styles.yellowPattern, styles.bluePattern] }, // March
      { day: 12, month: 2, year: 2024, patterns: [styles.redPattern, styles.yellowPattern] },
      { day: 19, month: 2, year: 2024, patterns: [styles.bluePattern, styles.redPattern] },
      { day: 4, month: 3, year: 2024, patterns: [styles.redPattern, styles.yellowPattern, styles.bluePattern] }, // April
      { day: 12, month: 3, year: 2024, patterns: [styles.redPattern, styles.yellowPattern] },
      { day: 19, month: 3, year: 2024, patterns: [styles.bluePattern, styles.redPattern] },
      { day: 4, month: 4, year: 2024, patterns: [styles.redPattern, styles.yellowPattern, styles.bluePattern] }, // May
      { day: 12, month: 4, year: 2024, patterns: [styles.redPattern, styles.yellowPattern] },
      { day: 19, month: 4, year: 2024, patterns: [styles.bluePattern, styles.redPattern] },
      { day: 4, month: 5, year: 2024, patterns: [styles.redPattern, styles.yellowPattern, styles.bluePattern] }, // June
      { day: 12, month: 5, year: 2024, patterns: [styles.redPattern, styles.yellowPattern] },
      { day: 19, month: 5, year: 2024, patterns: [styles.bluePattern, styles.redPattern] },
      { day: 4, month: 6, year: 2024, patterns: [styles.redPattern, styles.yellowPattern, styles.bluePattern] }, // July
      { day: 12, month: 6, year: 2024, patterns: [styles.redPattern, styles.yellowPattern] },
      { day: 19, month: 6, year: 2024, patterns: [styles.bluePattern, styles.redPattern] },
      { day: 4, month: 7, year: 2024, patterns: [styles.redPattern, styles.yellowPattern, styles.bluePattern] }, // August
      { day: 12, month: 7, year: 2024, patterns: [styles.redPattern, styles.yellowPattern] },
      { day: 19, month: 7, year: 2024, patterns: [styles.bluePattern, styles.redPattern] },
      { day: 4, month: 8, year: 2024, patterns: [styles.redPattern, styles.yellowPattern, styles.bluePattern] }, // September
      { day: 12, month: 8, year: 2024, patterns: [styles.redPattern, styles.yellowPattern] },
      { day: 19, month: 8, year: 2024, patterns: [styles.bluePattern, styles.redPattern] },
      { day: 4, month: 9, year: 2024, patterns: [styles.redPattern, styles.yellowPattern, styles.bluePattern] }, // October
      { day: 12, month: 9, year: 2024, patterns: [styles.redPattern, styles.yellowPattern] },
      { day: 19, month: 9, year: 2024, patterns: [styles.bluePattern, styles.redPattern] },
      { day: 4, month: 10, year: 2024, patterns: [styles.redPattern, styles.yellowPattern, styles.bluePattern] }, // November
      { day: 12, month: 10, year: 2024, patterns: [styles.redPattern, styles.yellowPattern] },
      { day: 19, month: 10, year: 2024, patterns: [styles.bluePattern, styles.redPattern] },
      { day: 4, month: 11, year: 2024, patterns: [styles.redPattern, styles.yellowPattern, styles.bluePattern] }, // December
      { day: 12, month: 11, year: 2024, patterns: [styles.redPattern, styles.yellowPattern] },
      { day: 19, month: 11, year: 2024, patterns: [styles.bluePattern, styles.redPattern] },
    ];

    return [
      ...emptyCells,
      ...days.map(day => {
        const dateHasPattern = patternDays.find(d => d.day === day && d.month === month && d.year === year);
        return (
          <div
            key={day}
            className={`${styles.day} ${isYearView ? styles.Calendar_days__gFcrZ : ''} ${selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year ? styles.selectedDay : ''}`}
            onClick={() => handleDateClick(day, month, year)}
          >
            <span>{day}</span>
            {dateHasPattern && (
              <div className={styles.patternContainer}>
                {dateHasPattern.patterns.map((pattern, index) => (
                  <div key={index} className={pattern}></div>
                ))}
              </div>
            )}
          </div>
        );
      }),
    ];
  };

  const renderMonth = (month: number, year: number, isYearView: boolean = false): JSX.Element => (
    <div className={styles.month} key={`${month}-${year}`}>
      <div className={styles.monthTitle}>{`${new Date(year, month).toLocaleString('default', { month: 'long' })}`}</div>
      <div className={styles.daysOfWeek}>
        <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
      </div>
      <div className={`${styles.days} ${isYearView ? styles.Calendar_days__gFcrZ : ''}`}>
        {renderDays(month, year, isYearView)}
      </div>
    </div>
  );

  const renderYearView = (): JSX.Element => {
    const months = Array.from({ length: 12 }, (_, i) => i);
    return (
      <div className={styles.year}>
        {months.map(month => renderMonth(month, currentYear, true))}
      </div>
    );
  };

  const handleViewChange = (newView: 'month' | 'year'): void => {
    setView(newView);
  };

  return (
    <div className={styles.calendarContainer}>
      <h2 className={styles.title}>Calendar view</h2>
      <div className={styles.header}>
        <div className={styles.viewToggle}>
          <button onClick={view === 'month' ? handlePreviousMonth : handlePreviousYear}>&lt;</button>
          <span>{view === 'month' ? `${new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} ${currentYear}` : currentYear}</span>
          <button onClick={view === 'month' ? handleNextMonth : handleNextYear}>&gt;</button>
        </div>
        <div className={styles.dropdown}>
          <button className={styles.dropbtn}>{view === 'month' ? 'Month' : 'Year'} <IconChevronDown size="1rem" /></button>
          <div className={styles.dropdownContent}>
            <a onClick={() => handleViewChange('month')}>Month</a>
            <a onClick={() => handleViewChange('year')}>Year</a>
          </div>
        </div>
      </div>
      <div className={styles.calendar}>
        {view === 'month' ? renderMonth(currentMonth, currentYear) : renderYearView()}
      </div>
    </div>
  );
};

export default Calendar;
