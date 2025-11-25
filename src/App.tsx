import { useState, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { CalendarHeader } from './components/Calendar/CalendarHeader';
import { CalendarGrid } from './components/Calendar/CalendarGrid';
import { ScheduledItem } from './components/Calendar/ScheduledItem';
import { FilterControls } from './components/Sidebar/FilterControls';
import { UnscheduledPanel } from './components/Sidebar/UnscheduledPanel';
import { LessonCard } from './components/Sidebar/LessonCard';
import { AddLessonModal } from './components/Modals/AddLessonModal';
import { EditLessonModal } from './components/Modals/EditLessonModal';
import { ShiftDatesModal } from './components/Modals/ShiftDatesModal';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { useSermons } from './hooks/useSermons';
import { useSchedule } from './hooks/useSchedule';
import {
  useCreateScheduledLesson,
  useUpdateScheduledLesson,
  useDeleteScheduledLesson,
  useShiftDates,
} from './hooks/useUpdateSchedule';
import { useFilters, useFilteredSchedule } from './hooks/useFilters';
import { format } from './utils/dateUtils';
import type { CalendarView, ScheduledLesson, Sermon } from './types';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function CalendarApp() {
  // State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<ScheduledLesson | null>(null);
  const [shiftStartDate, setShiftStartDate] = useState<Date | null>(null);
  const [activeItem, setActiveItem] = useState<ScheduledLesson | Sermon | null>(null);
  const [activeItemType, setActiveItemType] = useState<'scheduled' | 'unscheduled' | null>(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);

  // Data hooks
  const { data: sermons = [], isLoading: sermonsLoading, error: sermonsError } = useSermons();
  const { data: schedule = [], isLoading: scheduleLoading, error: scheduleError } = useSchedule();

  // Mutation hooks
  const createLesson = useCreateScheduledLesson();
  const updateLesson = useUpdateScheduledLesson();
  const deleteLesson = useDeleteScheduledLesson();
  const shiftDates = useShiftDates();

  // Filters
  const {
    filters,
    toggleLessonType,
    toggleNeedsPrep,
    isLessonTypeSelected,
    allLessonTypes,
  } = useFilters();

  // Filtered schedule
  const filteredSchedule = useFilteredSchedule(schedule, filters);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Handlers
  const handleDayClick = useCallback((date: Date) => {
    setSelectedDate(date);
    setIsAddModalOpen(true);
  }, []);

  const handleLessonClick = useCallback((lesson: ScheduledLesson) => {
    setSelectedLesson(lesson);
    setIsEditModalOpen(true);
  }, []);

  const handleAddLesson = useCallback(
    async (data: Parameters<typeof createLesson.mutateAsync>[0]) => {
      await createLesson.mutateAsync(data);
      setIsAddModalOpen(false);
      setSelectedDate(null);
    },
    [createLesson]
  );

  const handleUpdateLesson = useCallback(
    async (id: string, updates: Parameters<typeof updateLesson.mutateAsync>[0]['updates']) => {
      await updateLesson.mutateAsync({ id, updates });
      setIsEditModalOpen(false);
      setSelectedLesson(null);
    },
    [updateLesson]
  );

  const handleDeleteLesson = useCallback(
    async (id: string) => {
      await deleteLesson.mutateAsync(id);
      setIsEditModalOpen(false);
      setSelectedLesson(null);
    },
    [deleteLesson]
  );

  const handleShiftDates = useCallback(
    async (items: ScheduledLesson[], daysToShift: number) => {
      await shiftDates.mutateAsync({ items, daysToShift });
      setIsShiftModalOpen(false);
      setShiftStartDate(null);
    },
    [shiftDates]
  );

  const handleOpenShiftModal = useCallback(() => {
    setShiftStartDate(new Date());
    setIsShiftModalOpen(true);
  }, []);

  // DnD handlers
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current;

    if (data?.type === 'scheduled') {
      setActiveItem(data.lesson);
      setActiveItemType('scheduled');
    } else if (data?.type === 'unscheduled') {
      setActiveItem(data.sermon);
      setActiveItemType('unscheduled');
    }
  }, []);

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;

      setActiveItem(null);
      setActiveItemType(null);

      if (!over) return;

      const activeData = active.data.current;
      const overData = over.data.current;

      // Dropping on a day cell
      if (over.id.toString().startsWith('day-')) {
        const targetDate = overData?.date as Date;
        if (!targetDate) return;

        const dateString = format(targetDate, 'yyyy-MM-dd');

        if (activeData?.type === 'scheduled') {
          // Moving a scheduled item to a new date
          const lesson = activeData.lesson as ScheduledLesson;
          if (lesson.properties.sermon_date !== dateString) {
            await updateLesson.mutateAsync({
              id: lesson.id,
              updates: { sermon_date: dateString },
            });
          }
        } else if (activeData?.type === 'unscheduled') {
          // Creating a new scheduled item from an unscheduled sermon
          setSelectedDate(targetDate);
          setIsAddModalOpen(true);
        }
      }
    },
    [updateLesson]
  );

  const isLoading = sermonsLoading || scheduleLoading;
  const hasError = sermonsError || scheduleError;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-full mx-auto px-4 py-4">
            <CalendarHeader
              currentDate={currentDate}
              view={view}
              onNavigate={setCurrentDate}
              onViewChange={setView}
            />
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-full mx-auto px-4 py-6">
          {hasError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <p className="font-medium">Error loading data</p>
              <p className="text-sm mt-1">
                {sermonsError?.message || scheduleError?.message || 'An error occurred'}
              </p>
            </div>
          )}

          <div className="flex gap-6">
            {/* Left: Filters + Calendar */}
            <div className="flex-1 min-w-0">
              {/* Filter Controls */}
              <FilterControls
                filters={filters}
                allLessonTypes={allLessonTypes}
                isLessonTypeSelected={isLessonTypeSelected}
                onToggleLessonType={toggleLessonType}
                onToggleNeedsPrep={toggleNeedsPrep}
              />

              {/* Shift Dates Button */}
              <div className="mb-4">
                <button
                  onClick={handleOpenShiftModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                  Shift Dates
                </button>
              </div>

              {/* Calendar */}
              {isLoading ? (
                <div className="flex justify-center items-center h-96 bg-white rounded-lg shadow">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <CalendarGrid
                  currentDate={currentDate}
                  view={view}
                  lessons={filteredSchedule}
                  onDayClick={handleDayClick}
                  onLessonClick={handleLessonClick}
                />
              )}
            </div>

            {/* Right: Unscheduled Panel */}
            <div className="w-80 shrink-0">
              <UnscheduledPanel
                sermons={sermons}
                scheduledLessons={schedule}
                isLoading={sermonsLoading}
              />
            </div>
          </div>
        </main>

        {/* Modals */}
        <AddLessonModal
          isOpen={isAddModalOpen}
          selectedDate={selectedDate}
          sermons={sermons}
          onClose={() => {
            setIsAddModalOpen(false);
            setSelectedDate(null);
          }}
          onSubmit={handleAddLesson}
          isSubmitting={createLesson.isPending}
        />

        <EditLessonModal
          isOpen={isEditModalOpen}
          lesson={selectedLesson}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedLesson(null);
          }}
          onUpdate={handleUpdateLesson}
          onDelete={handleDeleteLesson}
          isUpdating={updateLesson.isPending}
          isDeleting={deleteLesson.isPending}
        />

        <ShiftDatesModal
          isOpen={isShiftModalOpen}
          startDate={shiftStartDate}
          lessons={schedule}
          filters={filters}
          onClose={() => {
            setIsShiftModalOpen(false);
            setShiftStartDate(null);
          }}
          onShift={handleShiftDates}
          isShifting={shiftDates.isPending}
        />

        {/* Drag Overlay */}
        <DragOverlay>
          {activeItem && activeItemType === 'scheduled' && (
            <div className="opacity-80">
              <ScheduledItem
                lesson={activeItem as ScheduledLesson}
                onClick={() => {}}
                compact
              />
            </div>
          )}
          {activeItem && activeItemType === 'unscheduled' && (
            <div className="opacity-80 w-64">
              <LessonCard sermon={activeItem as Sermon} />
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CalendarApp />
    </QueryClientProvider>
  );
}

export default App;
