import { useMemo } from 'react';
import { DayCell } from './DayCell';
import { getCalendarDays, getWeekDays, format } from '../../utils/dateUtils';
import type { ScheduledLesson, CalendarView } from '../../types';

interface CalendarGridProps {
  currentDate: Date;
  view: CalendarView;
  lessons: ScheduledLesson[];
  onDayClick: (date: Date) => void;
  onLessonClick: (lesson: ScheduledLesson) => void;
}

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarGrid({
  currentDate,
  view,
  lessons,
  onDayClick,
  onLessonClick,
}: CalendarGridProps) {
  // Get days to display based on view
  const days = useMemo(() => {
    return view === 'month' ? getCalendarDays(currentDate) : getWeekDays(currentDate);
  }, [currentDate, view]);

  // Group lessons by date for efficient lookup
  const lessonsByDate = useMemo(() => {
    const map = new Map<string, ScheduledLesson[]>();
    lessons.forEach((lesson) => {
      if (lesson.properties.sermon_date) {
        const dateKey = lesson.properties.sermon_date;
        const existing = map.get(dateKey) || [];
        map.set(dateKey, [...existing, lesson]);
      }
    });
    return map;
  }, [lessons]);

  // Get lessons for a specific date
  const getLessonsForDate = (date: Date): ScheduledLesson[] => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return lessonsByDate.get(dateKey) || [];
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
        {WEEKDAY_LABELS.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-sm font-semibold text-gray-600 border-r border-gray-200 last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className={`grid grid-cols-7 ${view === 'week' ? '' : ''}`}>
        {days.map((day) => (
          <DayCell
            key={day.toISOString()}
            date={day}
            currentMonth={currentDate}
            lessons={getLessonsForDate(day)}
            onDayClick={onDayClick}
            onLessonClick={onLessonClick}
            isWeekView={view === 'week'}
          />
        ))}
      </div>
    </div>
  );
}
