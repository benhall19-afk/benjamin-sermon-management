import { useDroppable } from '@dnd-kit/core';
import { format, isSameMonth, isToday } from '../../utils/dateUtils';
import { ScheduledItem } from './ScheduledItem';
import type { ScheduledLesson } from '../../types';

interface DayCellProps {
  date: Date;
  currentMonth: Date;
  lessons: ScheduledLesson[];
  onDayClick: (date: Date) => void;
  onLessonClick: (lesson: ScheduledLesson) => void;
  isWeekView?: boolean;
}

export function DayCell({
  date,
  currentMonth,
  lessons,
  onDayClick,
  onLessonClick,
  isWeekView = false,
}: DayCellProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `day-${format(date, 'yyyy-MM-dd')}`,
    data: {
      date,
    },
  });

  const isCurrentMonth = isSameMonth(date, currentMonth);
  const isCurrentDay = isToday(date);
  const dayNumber = date.getDate();

  // Sort lessons by lesson type for consistent ordering
  const sortedLessons = [...lessons].sort((a, b) => {
    const order = { 'Sermon AM': 1, 'Afternoon Study': 2, 'Sermon PM': 3 };
    const aOrder = order[a.properties.lesson_type as keyof typeof order] || 4;
    const bOrder = order[b.properties.lesson_type as keyof typeof order] || 4;
    return aOrder - bOrder;
  });

  const handleDayClick = () => {
    onDayClick(date);
  };

  return (
    <div
      ref={setNodeRef}
      onClick={handleDayClick}
      className={`
        ${isWeekView ? 'min-h-[300px]' : 'min-h-[120px]'}
        p-1 border-b border-r border-gray-200
        ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
        ${isOver ? 'bg-blue-50 ring-2 ring-inset ring-blue-400' : ''}
        ${isCurrentDay ? 'ring-2 ring-inset ring-blue-500' : ''}
        hover:bg-gray-50 transition-colors cursor-pointer
      `}
    >
      <div className="flex items-center justify-between mb-1">
        <span
          className={`
            inline-flex items-center justify-center h-6 w-6 rounded-full text-sm
            ${isCurrentDay ? 'bg-blue-600 text-white font-bold' : ''}
            ${!isCurrentMonth && !isCurrentDay ? 'text-gray-400' : 'text-gray-700'}
          `}
        >
          {dayNumber}
        </span>
        {lessons.length > 0 && (
          <span className="text-xs text-gray-400">{lessons.length}</span>
        )}
      </div>

      <div className="space-y-1 overflow-y-auto max-h-[calc(100%-28px)]">
        {sortedLessons.map((lesson) => (
          <ScheduledItem
            key={lesson.id}
            lesson={lesson}
            onClick={onLessonClick}
            compact={!isWeekView}
          />
        ))}
      </div>
    </div>
  );
}
