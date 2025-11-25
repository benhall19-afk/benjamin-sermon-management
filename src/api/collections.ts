import { craftFetch, COLLECTIONS } from './craftClient';
import type {
  Sermon,
  ScheduledLesson,
  ApiResponse,
  CreateItemRequest,
  UpdateItemRequest,
  DeleteItemRequest,
} from '../types';

// Fetch all sermons (source - Collection 5)
export async function fetchSermons(): Promise<Sermon[]> {
  const response = await craftFetch<ApiResponse<Sermon>>(
    `/collections/${COLLECTIONS.SERMONS}/items`
  );
  return response.items || [];
}

// Fetch all scheduled lessons (Collection 3)
export async function fetchScheduledLessons(): Promise<ScheduledLesson[]> {
  const response = await craftFetch<ApiResponse<ScheduledLesson>>(
    `/collections/${COLLECTIONS.SCHEDULE}/items`
  );
  return response.items || [];
}

// Create a new scheduled lesson
export async function createScheduledLesson(
  lesson: CreateItemRequest['items'][0]
): Promise<ScheduledLesson> {
  const response = await craftFetch<ApiResponse<ScheduledLesson>>(
    `/collections/${COLLECTIONS.SCHEDULE}/items`,
    {
      method: 'POST',
      body: JSON.stringify({ items: [lesson] }),
    }
  );
  return response.items[0];
}

// Update scheduled lessons (batch)
export async function updateScheduledLessons(
  updates: UpdateItemRequest['itemsToUpdate']
): Promise<ScheduledLesson[]> {
  const response = await craftFetch<ApiResponse<ScheduledLesson>>(
    `/collections/${COLLECTIONS.SCHEDULE}/items`,
    {
      method: 'PUT',
      body: JSON.stringify({ itemsToUpdate: updates }),
    }
  );
  return response.items || [];
}

// Update a single scheduled lesson
export async function updateScheduledLesson(
  id: string,
  updates: Partial<ScheduledLesson['properties']> & { title?: string }
): Promise<ScheduledLesson> {
  const { title, ...properties } = updates;
  const updatePayload: UpdateItemRequest['itemsToUpdate'][0] = {
    id,
    ...(title && { title }),
    ...(Object.keys(properties).length > 0 && { properties }),
  };

  const response = await craftFetch<ApiResponse<ScheduledLesson>>(
    `/collections/${COLLECTIONS.SCHEDULE}/items`,
    {
      method: 'PUT',
      body: JSON.stringify({ itemsToUpdate: [updatePayload] }),
    }
  );
  return response.items[0];
}

// Delete scheduled lessons
export async function deleteScheduledLessons(ids: string[]): Promise<void> {
  await craftFetch<void>(`/collections/${COLLECTIONS.SCHEDULE}/items`, {
    method: 'DELETE',
    body: JSON.stringify({ idsToDelete: ids } as DeleteItemRequest),
  });
}

// Bulk shift dates for scheduled lessons
export async function shiftScheduledDates(
  items: ScheduledLesson[],
  daysToShift: number
): Promise<ScheduledLesson[]> {
  const updates: UpdateItemRequest['itemsToUpdate'] = items.map((item) => {
    const currentDate = item.properties.sermon_date
      ? new Date(item.properties.sermon_date)
      : new Date();
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + daysToShift);

    return {
      id: item.id,
      properties: {
        sermon_date: newDate.toISOString().split('T')[0],
      },
    };
  });

  return updateScheduledLessons(updates);
}
