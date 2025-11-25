import { formatDateDisplay, addMonths, subMonths, addWeeks, subWeeks } from '../../utils/dateUtils';
import type { CalendarView } from '../../types';

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarView;
  onNavigate: (date: Date) => void;
  onViewChange: (view: CalendarView) => void;
}

export function CalendarHeader({ currentDate, view, onNavigate, onViewChange }: CalendarHeaderProps) {
  const handlePrevious = () => {
    if (view === 'month') {
      onNavigate(subMonths(currentDate, 1));
    } else {
      onNavigate(subWeeks(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (view === 'month') {
      onNavigate(addMonths(currentDate, 1));
    } else {
      onNavigate(addWeeks(currentDate, 1));
    }
  };

  const handleToday = () => {
    onNavigate(new Date());
  };

  return (
    <div className="flex items-center justify-between mb-4 px-2">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Bible Teaching Calendar</h1>
        <span className="text-lg text-gray-600">{formatDateDisplay(currentDate)}</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Navigation buttons */}
        <div className="flex items-center gap-1 mr-4">
          <button
            onClick={handlePrevious}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={view === 'month' ? 'Previous month' : 'Previous week'}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleToday}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Today
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={view === 'month' ? 'Next month' : 'Next week'}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* View toggle */}
        <div className="flex rounded-lg border border-gray-300 overflow-hidden">
          <button
            onClick={() => onViewChange('month')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              view === 'month'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => onViewChange('week')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              view === 'week'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Week
          </button>
        </div>
      </div>
    </div>
  );
}
