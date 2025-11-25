import { useState, useMemo } from 'react';
import { format, addDays } from '../../utils/dateUtils';
import { LessonTypeBadge } from '../common/LessonTypeBadge';
import type { ScheduledLesson, FilterState } from '../../types';

interface ShiftDatesModalProps {
  isOpen: boolean;
  startDate: Date | null;
  lessons: ScheduledLesson[];
  filters: FilterState;
  onClose: () => void;
  onShift: (items: ScheduledLesson[], daysToShift: number) => void;
  isShifting: boolean;
}

const SHIFT_OPTIONS = [
  { label: '1 week', days: 7 },
  { label: '2 weeks', days: 14 },
  { label: '3 weeks', days: 21 },
  { label: '4 weeks', days: 28 },
];

export function ShiftDatesModal({
  isOpen,
  startDate,
  lessons,
  filters,
  onClose,
  onShift,
  isShifting,
}: ShiftDatesModalProps) {
  const [shiftDays, setShiftDays] = useState(7);
  const [customDays, setCustomDays] = useState('');

  // Get lessons that will be affected (on or after the start date)
  const affectedLessons = useMemo(() => {
    if (!startDate) return [];

    const startDateStr = format(startDate, 'yyyy-MM-dd');

    return lessons.filter((lesson) => {
      // Must have a date
      if (!lesson.properties.sermon_date) return false;

      // Must be on or after the start date
      if (lesson.properties.sermon_date < startDateStr) return false;

      // Must match current lesson type filters
      if (
        lesson.properties.lesson_type &&
        !filters.lessonTypes.includes(lesson.properties.lesson_type)
      ) {
        return false;
      }

      return true;
    });
  }, [startDate, lessons, filters]);

  // Sort affected lessons by date
  const sortedAffectedLessons = useMemo(() => {
    return [...affectedLessons].sort((a, b) => {
      const dateA = a.properties.sermon_date || '';
      const dateB = b.properties.sermon_date || '';
      return dateA.localeCompare(dateB);
    });
  }, [affectedLessons]);

  const effectiveShiftDays = customDays ? parseInt(customDays, 10) : shiftDays;

  const handleShift = () => {
    if (affectedLessons.length === 0 || !effectiveShiftDays) return;
    onShift(affectedLessons, effectiveShiftDays);
  };

  const handleCustomDaysChange = (value: string) => {
    setCustomDays(value);
    if (value) {
      setShiftDays(0);
    }
  };

  const handlePresetSelect = (days: number) => {
    setShiftDays(days);
    setCustomDays('');
  };

  if (!isOpen || !startDate) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Shift Schedule Dates</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Starting from: {format(startDate, 'EEEE, MMMM d, yyyy')}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Shift Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Shift all lessons forward by:
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {SHIFT_OPTIONS.map((option) => (
                <button
                  key={option.days}
                  type="button"
                  onClick={() => handlePresetSelect(option.days)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${shiftDays === option.days && !customDays
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Custom:</span>
              <input
                type="number"
                value={customDays}
                onChange={(e) => handleCustomDaysChange(e.target.value)}
                placeholder="days"
                min="1"
                max="365"
                className="w-24 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-sm text-gray-600">days</span>
            </div>
          </div>

          {/* Filter notice */}
          {filters.lessonTypes.length < 3 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Only lessons matching your current filters will be shifted:
              </p>
              <div className="flex gap-1 mt-2">
                {filters.lessonTypes.map((type) => (
                  <LessonTypeBadge key={type} lessonType={type} size="sm" />
                ))}
              </div>
            </div>
          )}

          {/* Affected Lessons Preview */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Affected Lessons ({affectedLessons.length})
            </h3>
            {affectedLessons.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                No lessons will be affected by this shift.
              </p>
            ) : (
              <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
                {sortedAffectedLessons.map((lesson) => {
                  const currentDate = lesson.properties.sermon_date
                    ? new Date(lesson.properties.sermon_date)
                    : new Date();
                  const newDate = addDays(currentDate, effectiveShiftDays);

                  return (
                    <div key={lesson.id} className="p-3 text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900 truncate">
                          {lesson.title}
                        </span>
                        <LessonTypeBadge lessonType={lesson.properties.lesson_type} size="sm" />
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span>{format(currentDate, 'MMM d')}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                        <span className="font-medium text-blue-600">
                          {format(newDate, 'MMM d')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleShift}
            disabled={isShifting || affectedLessons.length === 0 || !effectiveShiftDays}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isShifting ? 'Shifting...' : `Shift ${affectedLessons.length} Lessons`}
          </button>
        </div>
      </div>
    </div>
  );
}
