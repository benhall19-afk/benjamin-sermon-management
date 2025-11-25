import { useState, useEffect } from 'react';
import { format } from '../../utils/dateUtils';
import type {
  ScheduledLesson,
  ScheduleLessonType,
  ScheduleStatus,
  Preacher,
  SpecialEvent,
} from '../../types';

interface EditLessonModalProps {
  isOpen: boolean;
  lesson: ScheduledLesson | null;
  onClose: () => void;
  onUpdate: (
    id: string,
    updates: Partial<ScheduledLesson['properties']> & { title?: string }
  ) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

const LESSON_TYPES: ScheduleLessonType[] = ['Sermon AM', 'Afternoon Study', 'Sermon PM'];
const STATUSES: ScheduleStatus[] = ['idea', 'in progress', 'complete', 'archive'];
const PREACHERS: Preacher[] = [
  'Benjamin',
  'Boss',
  'Leo',
  'Diamond',
  'Thomas Tucker',
  'Shane',
  'George Hammett',
];
const SPECIAL_EVENTS: SpecialEvent[] = [
  'Christmas',
  'Mothers Day',
  'Fathers Day',
  'Thanksgiving',
  'Resurrection Day',
  'New Years',
  'Baptism',
];

export function EditLessonModal({
  isOpen,
  lesson,
  onClose,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
}: EditLessonModalProps) {
  const [title, setTitle] = useState('');
  const [lessonType, setLessonType] = useState<ScheduleLessonType>('Sermon AM');
  const [status, setStatus] = useState<ScheduleStatus>('idea');
  const [preacher, setPreacher] = useState<Preacher | ''>('');
  const [specialEvent, setSpecialEvent] = useState<SpecialEvent | ''>('');
  const [notes, setNotes] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Reset form when lesson changes
  useEffect(() => {
    if (lesson) {
      setTitle(lesson.title || '');
      setLessonType(lesson.properties.lesson_type || 'Sermon AM');
      setStatus(lesson.properties.status || 'idea');
      setPreacher(lesson.properties.preacher || '');
      setSpecialEvent(lesson.properties.special_event || '');
      setNotes(lesson.properties.notes || '');
      setShowDeleteConfirm(false);
    }
  }, [lesson]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lesson) return;

    onUpdate(lesson.id, {
      title,
      lesson_type: lessonType,
      status,
      preacher: preacher || undefined,
      special_event: specialEvent || undefined,
      notes: notes || undefined,
    });
  };

  const handleDelete = () => {
    if (!lesson) return;
    onDelete(lesson.id);
  };

  if (!isOpen || !lesson) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Edit Scheduled Lesson</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {lesson.properties.sermon_date && (
            <p className="text-sm text-gray-600 mt-1">
              Scheduled for: {format(new Date(lesson.properties.sermon_date), 'EEEE, MMMM d, yyyy')}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Lesson Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lesson Type
              </label>
              <div className="flex gap-2">
                {LESSON_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setLessonType(type)}
                    className={`
                      px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                      ${lessonType === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`
                      px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize
                      ${status === s
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Preacher */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preacher
              </label>
              <select
                value={preacher}
                onChange={(e) => setPreacher(e.target.value as Preacher | '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select preacher...</option>
                {PREACHERS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Special Event */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Event
              </label>
              <select
                value={specialEvent}
                onChange={(e) => setSpecialEvent(e.target.value as SpecialEvent | '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">None</option>
                {SPECIAL_EVENTS.map((event) => (
                  <option key={event} value={event}>
                    {event}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Add any notes..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>

            {/* Delete Section */}
            <div className="pt-4 border-t border-gray-200">
              {showDeleteConfirm ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800 mb-3">
                    Are you sure you want to remove this lesson from the schedule?
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {isDeleting ? 'Removing...' : 'Yes, Remove'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-sm text-red-600 hover:text-red-800 transition-colors"
                >
                  Remove from schedule
                </button>
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
              type="submit"
              disabled={isUpdating || !title.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
