import { getScheduleStatusClasses, getSermonStatusClasses } from '../../utils/colorMapping';
import type { ScheduleStatus, SermonStatus } from '../../types';

interface ScheduleStatusBadgeProps {
  status?: ScheduleStatus;
  showDot?: boolean;
}

export function ScheduleStatusBadge({ status, showDot = true }: ScheduleStatusBadgeProps) {
  if (!status) return null;

  const colors = getScheduleStatusClasses(status);

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
    >
      {showDot && <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />}
      {status}
    </span>
  );
}

interface SermonStatusBadgeProps {
  status?: SermonStatus;
  showDot?: boolean;
}

export function SermonStatusBadge({ status, showDot = true }: SermonStatusBadgeProps) {
  if (!status) return null;

  const colors = getSermonStatusClasses(status);

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
    >
      {showDot && <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />}
      {status}
    </span>
  );
}
