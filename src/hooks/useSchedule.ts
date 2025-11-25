import { useQuery } from '@tanstack/react-query';
import { fetchScheduledLessons } from '../api/collections';
import type { ScheduledLesson } from '../types';

export function useSchedule() {
  return useQuery<ScheduledLesson[], Error>({
    queryKey: ['schedule'],
    queryFn: fetchScheduledLessons,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}
