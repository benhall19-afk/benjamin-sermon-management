import { getLessonTypeClasses } from '../../utils/colorMapping';
import type { ScheduleLessonType, FilterState } from '../../types';

interface FilterControlsProps {
  filters: FilterState;
  allLessonTypes: ScheduleLessonType[];
  isLessonTypeSelected: (type: ScheduleLessonType) => boolean;
  onToggleLessonType: (type: ScheduleLessonType) => void;
  onToggleNeedsPrep: () => void;
}

export function FilterControls({
  filters,
  allLessonTypes,
  isLessonTypeSelected,
  onToggleLessonType,
  onToggleNeedsPrep,
}: FilterControlsProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Filters</h3>

      {/* Lesson Type Filters */}
      <div className="space-y-2 mb-4">
        {allLessonTypes.map((type) => {
          const colors = getLessonTypeClasses(type);
          const isSelected = isLessonTypeSelected(type);

          return (
            <label
              key={type}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleLessonType(type)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span
                className={`
                  px-2 py-0.5 rounded text-sm font-medium transition-opacity
                  ${colors.bg} ${colors.text} border ${colors.border}
                  ${!isSelected ? 'opacity-50' : ''}
                  group-hover:opacity-100
                `}
              >
                {type}
              </span>
            </label>
          );
        })}
      </div>

      {/* Needs Preparation Filter */}
      <div className="border-t border-gray-200 pt-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.showOnlyNeedsPrep}
            onChange={onToggleNeedsPrep}
            className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
          />
          <span className="text-sm text-gray-700">
            Show only needing preparation
          </span>
        </label>
        <p className="mt-1 text-xs text-gray-500 ml-6">
          Hides items marked as &quot;complete&quot; or &quot;archive&quot;
        </p>
      </div>
    </div>
  );
}
