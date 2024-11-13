export const CalendarSource = {
    MicrosoftCalendar: "microsoft_calendar",
    GoogleCalendar: "google_calendar",
} as const;
export type CalendarSource =
    (typeof CalendarSource)[keyof typeof CalendarSource];