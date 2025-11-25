import { useState, useMemo } from 'react';
import { LessonCard } from './LessonCard';
import { LoadingSpinner } from '../common/LoadingSpinner';
import type { Sermon, ScheduledLesson, SourceLessonType, SermonStatus } from '../../types';

interface UnscheduledPanelProps {
  sermons: Sermon[];
  scheduledLessons: ScheduledLesson[];
  isLoading: boolean;
  onSermonClick?: (sermon: Sermon) => void;
}

export function UnscheduledPanel({
  sermons,
  scheduledLessons,
  isLoading,
  onSermonClick,
}: UnscheduledPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [lessonTypeFilter, setLessonTypeFilter] = useState<SourceLessonType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<SermonStatus | 'all'>('all');

  // Get IDs of sermons that are already scheduled
  const scheduledSermonIds = useMemo(() => {
    return new Set(
      scheduledLessons
        .filter((lesson) => lesson.properties.sermon)
        .map((lesson) => lesson.properties.sermon)
    );
  }, [scheduledLessons]);

  // Filter sermons that are not scheduled
  const unscheduledSermons = useMemo(() => {
    return sermons.filter((sermon) => !scheduledSermonIds.has(sermon.id));
  }, [sermons, scheduledSermonIds]);

  // Apply filters
  const filteredSermons = useMemo(() => {
    return unscheduledSermons.filter((sermon) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = sermon.title.toLowerCase().includes(query);
        const matchesSeries = sermon.properties.series?.toLowerCase().includes(query);
        const matchesText = sermon.properties.primary_text?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSeries && !matchesText) {
          return false;
        }
      }

      // Lesson type filter
      if (lessonTypeFilter !== 'all' && sermon.properties.lesson_type !== lessonTypeFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'all' && sermon.properties.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [unscheduledSermons, searchQuery, lessonTypeFilter, statusFilter]);

  // Group filtered sermons by lesson type
  const groupedSermons = useMemo(() => {
    const groups: Record<string, Sermon[]> = {};
    filteredSermons.forEach((sermon) => {
      const type = sermon.properties.lesson_type || 'Uncategorized';
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(sermon);
    });
    return groups;
  }, [filteredSermons]);

  const lessonTypes: SourceLessonType[] = [
    'Sermon',
    'Devotional',
    "Young Children's Bible Lesson",
    'Short English Bible Lesson',
    'Bible Lesson',
  ];

  const statusOptions: SermonStatus[] = ['Complete', 'Draft', 'Needs Polish', 'Ready to Preach'];

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Unscheduled Lessons</h2>
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Unscheduled Lessons
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({filteredSermons.length})
          </span>
        </h2>

        {/* Search */}
        <input
          type="text"
          placeholder="Search lessons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
        />

        {/* Filters */}
        <div className="flex gap-2">
          <select
            value={lessonTypeFilter}
            onChange={(e) => setLessonTypeFilter(e.target.value as SourceLessonType | 'all')}
            className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            {lessonTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as SermonStatus | 'all')}
            className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lesson list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(groupedSermons).length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No unscheduled lessons found
          </p>
        ) : (
          Object.entries(groupedSermons).map(([type, lessons]) => (
            <div key={type}>
              <h3 className="text-sm font-semibold text-gray-600 mb-2 sticky top-0 bg-white py-1">
                {type}
                <span className="ml-1 text-gray-400">({lessons.length})</span>
              </h3>
              <div className="space-y-2">
                {lessons.map((sermon) => (
                  <LessonCard
                    key={sermon.id}
                    sermon={sermon}
                    onClick={onSermonClick}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
