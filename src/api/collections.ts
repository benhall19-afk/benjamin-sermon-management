import { craftFetch, COLLECTIONS } from './craftClient';
import type {
  Sermon,
  ScheduledLesson,
  CreateItemRequest,
  UpdateItemRequest,
  DeleteItemRequest,
} from '../types';

// Raw API response types (matching actual API structure)
interface RawScheduledLesson {
  id: string;
  sermon_name: string;
  properties: {
    status?: string;
    lesson_type?: string;
    sermon_date?: string;
    preacher?: string;
    special_event?: string;
    notes?: string;
    series_number?: number;
    sermon_series_name?: string;
    sermon?: string;
    sermonlesson?: {
      title: string;
      warning?: string;
      reference?: { blockId: string };
    };
  };
  content?: unknown[];
}

interface RawSermon {
  id: string;
  sermon_title: string;
  properties: {
    series?: string;
    primary_text?: string;
    sermon_themefocus?: string;
    date_preached?: string;
    audience?: string;
    seasonholiday?: string;
    length_minutes?: number;
    status?: string;
    key_takeaway?: string;
    sermon_information_added?: boolean;
    lesson_type?: string;
  };
  content?: Array<{
    id: string;
    type: string;
    markdown?: string;
  }>;
}

interface ApiResponse<T> {
  items: T[];
}

// Transform raw scheduled lesson to our internal format
function transformScheduledLesson(raw: RawScheduledLesson): ScheduledLesson {
  return {
    id: raw.id,
    title: raw.sermon_name,
    properties: {
      status: raw.properties.status as ScheduledLesson['properties']['status'],
      lesson_type: raw.properties.lesson_type as ScheduledLesson['properties']['lesson_type'],
      sermon_date: raw.properties.sermon_date,
      preacher: raw.properties.preacher as ScheduledLesson['properties']['preacher'],
      special_event: raw.properties.special_event as ScheduledLesson['properties']['special_event'],
      notes: raw.properties.notes,
      series_number: raw.properties.series_number,
      sermon_series_name: raw.properties.sermon_series_name,
      sermon: raw.properties.sermon,
    },
  };
}

// Transform raw sermon to our internal format
function transformSermon(raw: RawSermon): Sermon {
  return {
    id: raw.id,
    title: raw.sermon_title,
    properties: {
      series: raw.properties.series,
      primary_text: raw.properties.primary_text,
      sermon_themefocus: raw.properties.sermon_themefocus,
      date_preached: raw.properties.date_preached,
      audience: raw.properties.audience,
      seasonholiday: raw.properties.seasonholiday,
      length_minutes: raw.properties.length_minutes,
      status: raw.properties.status as Sermon['properties']['status'],
      key_takeaway: raw.properties.key_takeaway,
      sermon_information_added: raw.properties.sermon_information_added,
      lesson_type: raw.properties.lesson_type as Sermon['properties']['lesson_type'],
    },
  };
}

// Fetch all sermons (source - Collection 5)
export async function fetchSermons(): Promise<Sermon[]> {
  const response = await craftFetch<ApiResponse<RawSermon>>(
    `/collections/${COLLECTIONS.SERMONS}/items`
  );
  return (response.items || []).map(transformSermon);
}

// Fetch all scheduled lessons (Collection 3)
export async function fetchScheduledLessons(): Promise<ScheduledLesson[]> {
  const response = await craftFetch<ApiResponse<RawScheduledLesson>>(
    `/collections/${COLLECTIONS.SCHEDULE}/items`
  );
  return (response.items || []).map(transformScheduledLesson);
}

// Create a new scheduled lesson
export async function createScheduledLesson(
  lesson: CreateItemRequest['items'][0]
): Promise<ScheduledLesson> {
  // Transform to API format: title -> sermon_name
  const apiPayload = {
    items: [{
      sermon_name: lesson.title,
      properties: lesson.properties,
    }],
  };

  const response = await craftFetch<ApiResponse<RawScheduledLesson>>(
    `/collections/${COLLECTIONS.SCHEDULE}/items`,
    {
      method: 'POST',
      body: JSON.stringify(apiPayload),
    }
  );
  return transformScheduledLesson(response.items[0]);
}

// Update scheduled lessons (batch)
export async function updateScheduledLessons(
  updates: UpdateItemRequest['itemsToUpdate']
): Promise<ScheduledLesson[]> {
  // Transform to API format: title -> sermon_name
  const apiUpdates = updates.map((update) => ({
    id: update.id,
    ...(update.title && { sermon_name: update.title }),
    ...(update.properties && { properties: update.properties }),
  }));

  const response = await craftFetch<ApiResponse<RawScheduledLesson>>(
    `/collections/${COLLECTIONS.SCHEDULE}/items`,
    {
      method: 'PUT',
      body: JSON.stringify({ itemsToUpdate: apiUpdates }),
    }
  );
  return (response.items || []).map(transformScheduledLesson);
}

// Update a single scheduled lesson
export async function updateScheduledLesson(
  id: string,
  updates: Partial<ScheduledLesson['properties']> & { title?: string }
): Promise<ScheduledLesson> {
  const { title, ...properties } = updates;
  const updatePayload = {
    id,
    ...(title && { sermon_name: title }),
    ...(Object.keys(properties).length > 0 && { properties }),
  };

  const response = await craftFetch<ApiResponse<RawScheduledLesson>>(
    `/collections/${COLLECTIONS.SCHEDULE}/items`,
    {
      method: 'PUT',
      body: JSON.stringify({ itemsToUpdate: [updatePayload] }),
    }
  );
  return transformScheduledLesson(response.items[0]);
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
