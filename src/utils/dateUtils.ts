import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
  addDays,
} from 'date-fns';

export {
  format,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
  addDays,
};

// Get all days to display in a month view calendar (including padding days)
export function getCalendarDays(date: Date): Date[] {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
}

// Get days for a week view
export function getWeekDays(date: Date): Date[] {
  const weekStart = startOfWeek(date, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 0 });

  return eachDayOfInterval({ start: weekStart, end: weekEnd });
}

// Format date for display
export function formatDateDisplay(date: Date): string {
  return format(date, 'MMMM yyyy');
}

// Format date for API (YYYY-MM-DD)
export function formatDateForApi(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

// Parse API date string to Date
export function parseApiDate(dateString: string): Date {
  return parseISO(dateString);
}

// Get day of month
export function getDayOfMonth(date: Date): number {
  return date.getDate();
}

// Check if date is in the past
export function isPastDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate < today;
}

// Calculate weeks difference
export function weeksDifference(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7);
}

// Get dates after a specific date
export function isDateOnOrAfter(date: Date, referenceDate: Date): boolean {
  const d1 = new Date(date);
  d1.setHours(0, 0, 0, 0);
  const d2 = new Date(referenceDate);
  d2.setHours(0, 0, 0, 0);
  return d1 >= d2;
}
