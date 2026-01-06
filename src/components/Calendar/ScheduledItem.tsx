import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { LessonTypeBadge } from '../common/LessonTypeBadge';
import { getScheduleStatusClasses } from '../../utils/colorMapping';
import type { ScheduledLesson } from '../../types';

interface ScheduledItemProps {
  lesson: ScheduledLesson;
  onClick: (lesson: ScheduledLesson) => void;
  compact?: boolean;
}

export function ScheduledItem({ lesson, onClick, compact = false }: ScheduledItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `scheduled-${lesson.id}`,
    data: {
      type: 'scheduled',
      lesson,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const statusColors = getScheduleStatusClasses(lesson.properties.status);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(lesson);
  };

  if (compact) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        onClick={handleClick}
        className={`
          draggable-item
          flex items-center gap-1 p-1 rounded text-xs cursor-pointer
          bg-white border shadow-sm hover:shadow transition-shadow
          ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
        `}
      >
        <span className={`h-2 w-2 rounded-full ${statusColors.dot} shrink-0`} />
        <LessonTypeBadge lessonType={lesson.properties.lesson_type} size="sm" />
        <span className="truncate text-gray-700">{lesson.title}</span>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      className={`
        draggable-item
        p-2 rounded-lg bg-white border shadow-sm hover:shadow-md transition-all
        ${isDragging ? 'cursor-grabbing ring-2 ring-blue-400' : 'cursor-grab'}
      `}
    >
      <div className="flex items-start gap-2">
        <span className={`mt-1.5 h-2 w-2 rounded-full ${statusColors.dot} shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <LessonTypeBadge lessonType={lesson.properties.lesson_type} size="sm" />
          </div>
          <p className="text-sm font-medium text-gray-900 truncate">{lesson.title}</p>
          {lesson.properties.preacher && (
            <p className="text-xs text-gray-500 mt-0.5">{lesson.properties.preacher}</p>
          )}
        </div>
      </div>
    </div>
  );
}
