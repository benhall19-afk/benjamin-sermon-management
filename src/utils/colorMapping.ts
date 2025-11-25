import type { ScheduleLessonType, ScheduleStatus, SermonStatus } from '../types';

// Lesson type colors for scheduled items
export const lessonTypeColors: Record<ScheduleLessonType, { bg: string; text: string; border: string }> = {
  'Sermon AM': {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300',
  },
  'Afternoon Study': {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    border: 'border-emerald-300',
  },
  'Sermon PM': {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-300',
  },
};

// Status colors for scheduled items
export const scheduleStatusColors: Record<ScheduleStatus, { bg: string; text: string; dot: string }> = {
  idea: {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    dot: 'bg-amber-500',
  },
  'in progress': {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    dot: 'bg-blue-500',
  },
  complete: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    dot: 'bg-emerald-500',
  },
  archive: {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    dot: 'bg-gray-400',
  },
};

// Status colors for source sermons
export const sermonStatusColors: Record<SermonStatus, { bg: string; text: string; dot: string }> = {
  Draft: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    dot: 'bg-red-500',
  },
  'Needs Polish': {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    dot: 'bg-amber-500',
  },
  'Ready to Preach': {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    dot: 'bg-emerald-500',
  },
  Complete: {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    dot: 'bg-gray-400',
  },
};

// Get lesson type color classes
export function getLessonTypeClasses(lessonType?: ScheduleLessonType): { bg: string; text: string; border: string } {
  if (!lessonType || !lessonTypeColors[lessonType]) {
    return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300' };
  }
  return lessonTypeColors[lessonType];
}

// Get schedule status color classes
export function getScheduleStatusClasses(status?: ScheduleStatus): { bg: string; text: string; dot: string } {
  if (!status || !scheduleStatusColors[status]) {
    return { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' };
  }
  return scheduleStatusColors[status];
}

// Get sermon status color classes
export function getSermonStatusClasses(status?: SermonStatus): { bg: string; text: string; dot: string } {
  if (!status || !sermonStatusColors[status]) {
    return { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' };
  }
  return sermonStatusColors[status];
}
