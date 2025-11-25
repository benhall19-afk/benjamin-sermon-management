// Source sermon from Collection 5
export interface Sermon {
  id: string;
  title: string; // sermon_title (content property)
  properties: {
    series?: string;
    primary_text?: string;
    sermon_themefocus?: string;
    date_preached?: string;
    audience?: string;
    seasonholiday?: string;
    length_minutes?: number;
    status?: SermonStatus;
    key_takeaway?: string;
    sermon_information_added?: boolean;
    lesson_type?: SourceLessonType;
  };
}

// Scheduled lesson from Collection 3
export interface ScheduledLesson {
  id: string;
  title: string; // sermon_name (content property)
  properties: {
    status?: ScheduleStatus;
    lesson_type?: ScheduleLessonType;
    sermon_date?: string;
    preacher?: Preacher;
    special_event?: SpecialEvent;
    notes?: string;
    series_number?: number;
    sermon_series_name?: string;
    sermon?: string; // relation ID to Collection 5
  };
}

// Status types
export type SermonStatus = 'Complete' | 'Draft' | 'Needs Polish' | 'Ready to Preach';
export type ScheduleStatus = 'idea' | 'in progress' | 'complete' | 'archive';

// Lesson type for source sermons (Collection 5)
export type SourceLessonType =
  | 'Sermon'
  | 'Devotional'
  | "Young Children's Bible Lesson"
  | 'Short English Bible Lesson'
  | 'Bible Lesson';

// Lesson type for scheduled items (Collection 3)
export type ScheduleLessonType = 'Sermon AM' | 'Afternoon Study' | 'Sermon PM';

// Preachers
export type Preacher =
  | 'Benjamin'
  | 'Boss'
  | 'Leo'
  | 'Diamond'
  | 'Thomas Tucker'
  | 'Shane'
  | 'George Hammett';

// Special events
export type SpecialEvent =
  | 'Christmas'
  | 'Mothers Day'
  | 'Fathers Day'
  | 'Thanksgiving'
  | 'Resurrection Day'
  | 'New Years'
  | 'Baptism';

// Series types
export type Series =
  | 'Foundational Discipleship'
  | 'Gospel & Redemption'
  | 'Daily Christian Living'
  | 'Special & Seasonal'
  | 'Other';

// Theme types
export type SermonTheme =
  | 'Faith'
  | 'Obedience'
  | 'Grace'
  | 'Worship'
  | 'Evangelism'
  | 'Discipleship'
  | 'Redemption'
  | 'Character'
  | 'Work & Purpose'
  | 'Community/Family';

// Audience types
export type Audience = 'Adults' | 'Youth' | 'Mixed' | 'Families' | 'Men' | 'Women';

// Filter state
export interface FilterState {
  lessonTypes: ScheduleLessonType[];
  showOnlyNeedsPrep: boolean;
}

// API response types
export interface ApiResponse<T> {
  items: T[];
}

export interface CreateItemRequest {
  items: Array<{
    title: string;
    properties: Record<string, unknown>;
  }>;
}

export interface UpdateItemRequest {
  itemsToUpdate: Array<{
    id: string;
    title?: string;
    properties?: Record<string, unknown>;
  }>;
}

export interface DeleteItemRequest {
  idsToDelete: string[];
}

// Calendar view types
export type CalendarView = 'month' | 'week';

// Drag and drop types
export interface DragItem {
  type: 'scheduled' | 'unscheduled';
  id: string;
  sermon?: Sermon;
  scheduledLesson?: ScheduledLesson;
}
