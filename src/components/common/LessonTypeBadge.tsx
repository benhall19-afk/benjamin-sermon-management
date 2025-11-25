import { getLessonTypeClasses } from '../../utils/colorMapping';
import type { ScheduleLessonType } from '../../types';

interface LessonTypeBadgeProps {
  lessonType?: ScheduleLessonType;
  size?: 'sm' | 'md';
}

export function LessonTypeBadge({ lessonType, size = 'md' }: LessonTypeBadgeProps) {
  if (!lessonType) return null;

  const colors = getLessonTypeClasses(lessonType);
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-sm';

  // Short labels for calendar display
  const shortLabels: Record<ScheduleLessonType, string> = {
    'Sermon AM': 'AM',
    'Afternoon Study': 'Study',
    'Sermon PM': 'PM',
  };

  return (
    <span
      className={`inline-flex items-center rounded font-medium ${colors.bg} ${colors.text} border ${colors.border} ${sizeClasses}`}
    >
      {size === 'sm' ? shortLabels[lessonType] : lessonType}
    </span>
  );
}
