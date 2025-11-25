import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createScheduledLesson,
  updateScheduledLesson,
  updateScheduledLessons,
  deleteScheduledLessons,
  shiftScheduledDates,
} from '../api/collections';
import type { ScheduledLesson, ScheduleLessonType, Preacher, SpecialEvent, ScheduleStatus } from '../types';

// Create a new scheduled lesson
export function useCreateScheduledLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      title: string;
      sermon_date: string;
      lesson_type: ScheduleLessonType;
      preacher?: Preacher;
      special_event?: SpecialEvent;
      notes?: string;
      sermon?: string;
      status?: ScheduleStatus;
    }) => {
      return createScheduledLesson({
        title: data.title,
        properties: {
          sermon_date: data.sermon_date,
          lesson_type: data.lesson_type,
          preacher: data.preacher,
          special_event: data.special_event,
          notes: data.notes,
          sermon: data.sermon,
          status: data.status || 'idea',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
    },
  });
}

// Update a scheduled lesson
export function useUpdateScheduledLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<ScheduledLesson['properties']> & { title?: string };
    }) => {
      return updateScheduledLesson(id, updates);
    },
    onMutate: async ({ id, updates }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['schedule'] });

      // Snapshot the previous value
      const previousSchedule = queryClient.getQueryData<ScheduledLesson[]>(['schedule']);

      // Optimistically update the cache
      if (previousSchedule) {
        queryClient.setQueryData<ScheduledLesson[]>(['schedule'], (old) =>
          old?.map((item) =>
            item.id === id
              ? {
                  ...item,
                  title: updates.title || item.title,
                  properties: { ...item.properties, ...updates },
                }
              : item
          )
        );
      }

      return { previousSchedule };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousSchedule) {
        queryClient.setQueryData(['schedule'], context.previousSchedule);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
    },
  });
}

// Batch update scheduled lessons (for date shifts)
export function useBatchUpdateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateScheduledLessons,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
    },
  });
}

// Delete a scheduled lesson
export function useDeleteScheduledLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteScheduledLessons([id]),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['schedule'] });
      const previousSchedule = queryClient.getQueryData<ScheduledLesson[]>(['schedule']);

      if (previousSchedule) {
        queryClient.setQueryData<ScheduledLesson[]>(['schedule'], (old) =>
          old?.filter((item) => item.id !== id)
        );
      }

      return { previousSchedule };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousSchedule) {
        queryClient.setQueryData(['schedule'], context.previousSchedule);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
    },
  });
}

// Shift dates for multiple lessons
export function useShiftDates() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ items, daysToShift }: { items: ScheduledLesson[]; daysToShift: number }) => {
      return shiftScheduledDates(items, daysToShift);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
    },
  });
}
