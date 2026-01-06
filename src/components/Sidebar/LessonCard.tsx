import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { SermonStatusBadge } from '../common/StatusBadge';
import type { Sermon } from '../../types';

interface LessonCardProps {
  sermon: Sermon;
  onClick?: (sermon: Sermon) => void;
}

export function LessonCard({ sermon, onClick }: LessonCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `sermon-${sermon.id}`,
    data: {
      type: 'unscheduled',
      sermon,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const handleClick = () => {
    onClick?.(sermon);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      className={`
        draggable-item
        p-3 bg-white rounded-lg border border-gray-200 shadow-sm
        hover:shadow-md hover:border-gray-300 transition-all
        ${isDragging ? 'cursor-grabbing ring-2 ring-blue-400' : 'cursor-grab'}
      `}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
          {sermon.title}
        </h4>
        <SermonStatusBadge status={sermon.properties.status} showDot={false} />
      </div>

      {sermon.properties.series && (
        <p className="text-xs text-gray-500 mb-1">
          Series: {sermon.properties.series}
        </p>
      )}

      {sermon.properties.primary_text && (
        <p className="text-xs text-gray-600 italic">
          {sermon.properties.primary_text}
        </p>
      )}

      {sermon.properties.lesson_type && (
        <div className="mt-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
            {sermon.properties.lesson_type}
          </span>
        </div>
      )}
    </div>
  );
}
