import { useState, useCallback, useMemo } from 'react';
import type { FilterState, ScheduleLessonType, ScheduledLesson } from '../types';

const ALL_LESSON_TYPES: ScheduleLessonType[] = ['Sermon AM', 'Afternoon Study', 'Sermon PM'];

export function useFilters() {
  const [filters, setFilters] = useState<FilterState>({
    lessonTypes: [...ALL_LESSON_TYPES],
    showOnlyNeedsPrep: false,
  });

  const toggleLessonType = useCallback((lessonType: ScheduleLessonType) => {
    setFilters((prev) => {
      const isCurrentlySelected = prev.lessonTypes.includes(lessonType);
      if (isCurrentlySelected) {
        // Don't allow deselecting all types
        if (prev.lessonTypes.length === 1) return prev;
        return {
          ...prev,
          lessonTypes: prev.lessonTypes.filter((lt) => lt !== lessonType),
        };
      } else {
        return {
          ...prev,
          lessonTypes: [...prev.lessonTypes, lessonType],
        };
      }
    });
  }, []);

  const toggleNeedsPrep = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      showOnlyNeedsPrep: !prev.showOnlyNeedsPrep,
    }));
  }, []);

  const selectAllLessonTypes = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      lessonTypes: [...ALL_LESSON_TYPES],
    }));
  }, []);

  const isLessonTypeSelected = useCallback(
    (lessonType: ScheduleLessonType) => {
      return filters.lessonTypes.includes(lessonType);
    },
    [filters.lessonTypes]
  );

  return {
    filters,
    toggleLessonType,
    toggleNeedsPrep,
    selectAllLessonTypes,
    isLessonTypeSelected,
    allLessonTypes: ALL_LESSON_TYPES,
  };
}

// Filter scheduled lessons based on current filters
export function filterScheduledLessons(
  lessons: ScheduledLesson[],
  filters: FilterState
): ScheduledLesson[] {
  return lessons.filter((lesson) => {
    // Filter by lesson type
    if (lesson.properties.lesson_type && !filters.lessonTypes.includes(lesson.properties.lesson_type)) {
      return false;
    }

    // Filter by needs preparation
    if (filters.showOnlyNeedsPrep) {
      const status = lesson.properties.status;
      if (status === 'complete' || status === 'archive') {
        return false;
      }
    }

    return true;
  });
}

// Hook to get filtered lessons
export function useFilteredSchedule(lessons: ScheduledLesson[], filters: FilterState) {
  return useMemo(() => filterScheduledLessons(lessons, filters), [lessons, filters]);
}
