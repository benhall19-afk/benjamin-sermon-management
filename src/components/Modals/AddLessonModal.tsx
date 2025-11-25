import { useState, useMemo } from 'react';
import { format } from '../../utils/dateUtils';
import { SermonStatusBadge } from '../common/StatusBadge';
import type {
  Sermon,
  ScheduleLessonType,
  Preacher,
  SpecialEvent,
} from '../../types';

interface AddLessonModalProps {
  isOpen: boolean;
  selectedDate: Date | null;
  sermons: Sermon[];
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    sermon_date: string;
    lesson_type: ScheduleLessonType;
    preacher?: Preacher;
    special_event?: SpecialEvent;
    notes?: string;
    sermon?: string;
  }) => void;
  isSubmitting: boolean;
}

const LESSON_TYPES: ScheduleLessonType[] = ['Sermon AM', 'Afternoon Study', 'Sermon PM'];
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

export function AddLessonModal({
  isOpen,
  selectedDate,
  sermons,
  onClose,
  onSubmit,
  isSubmitting,
}: AddLessonModalProps) {
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);
  const [lessonType, setLessonType] = useState<ScheduleLessonType>('Sermon AM');
  const [preacher, setPreacher] = useState<Preacher | ''>('Benjamin');
  const [specialEvent, setSpecialEvent] = useState<SpecialEvent | ''>('');
  const [notes, setNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [customTitle, setCustomTitle] = useState('');

  // Filter sermons by search query
  const filteredSermons = useMemo(() => {
    if (!searchQuery) return sermons;
    const query = searchQuery.toLowerCase();
    return sermons.filter(
      (s) =>
        s.title.toLowerCase().includes(query) ||
        s.properties.series?.toLowerCase().includes(query) ||
        s.properties.primary_text?.toLowerCase().includes(query)
    );
  }, [sermons, searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    const title = selectedSermon?.title || customTitle;
    if (!title.trim()) return;

    onSubmit({
      title,
      sermon_date: format(selectedDate, 'yyyy-MM-dd'),
      lesson_type: lessonType,
      preacher: preacher || undefined,
      special_event: specialEvent || undefined,
      notes: notes || undefined,
      sermon: selectedSermon?.id,
    });

    // Reset form
    setSelectedSermon(null);
    setLessonType('Sermon AM');
    setPreacher('Benjamin');
    setSpecialEvent('');
    setNotes('');
    setSearchQuery('');
    setCustomTitle('');
  };

  const handleSermonSelect = (sermon: Sermon) => {
    setSelectedSermon(sermon);
    setCustomTitle('');
  };

  const handleClearSelection = () => {
    setSelectedSermon(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Schedule Lesson</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {selectedDate && (
            <p className="text-sm text-gray-600 mt-1">
              Date: {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Sermon Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select a Lesson (optional)
              </label>

              {selectedSermon ? (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{selectedSermon.title}</p>
                      {selectedSermon.properties.series && (
                        <p className="text-sm text-gray-600">
                          Series: {selectedSermon.properties.series}
                        </p>
                      )}
                      {selectedSermon.properties.primary_text && (
                        <p className="text-sm text-gray-500 italic">
                          {selectedSermon.properties.primary_text}
                        </p>
                      )}
                      <div className="mt-2">
                        <SermonStatusBadge status={selectedSermon.properties.status} />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearSelection}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Search lessons..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
                    {filteredSermons.slice(0, 20).map((sermon) => (
                      <button
                        key={sermon.id}
                        type="button"
                        onClick={() => handleSermonSelect(sermon)}
                        className="w-full p-3 text-left hover:bg-gray-50 transition-colors"
                      >
                        <p className="font-medium text-gray-900 text-sm">{sermon.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {sermon.properties.series && (
                            <span className="text-xs text-gray-500">
                              {sermon.properties.series}
                            </span>
                          )}
                          <SermonStatusBadge status={sermon.properties.status} showDot={false} />
                        </div>
                      </button>
                    ))}
                    {filteredSermons.length === 0 && (
                      <p className="p-3 text-sm text-gray-500 text-center">No lessons found</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Custom Title (if no sermon selected) */}
            {!selectedSermon && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or Enter Custom Title
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g., Guest Speaker - John Smith"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {/* Lesson Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lesson Type *
              </label>
              <div className="flex gap-2">
                {LESSON_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setLessonType(type)}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium transition-colors
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
                Special Event (optional)
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
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Add any notes..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
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
              disabled={isSubmitting || (!selectedSermon && !customTitle.trim())}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Scheduling...' : 'Schedule Lesson'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
