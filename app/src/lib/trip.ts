export const TRIP_DATES = Array.from(
  { length: 15 },
  (_, index) => `2026-08-${String(index + 9).padStart(2, '0')}`,
);

export type TripPhase = 'before' | 'during' | 'after';
export type TemporalState = 'past' | 'today' | 'future';
export type DrivingLevel = 'zero' | 'poca' | 'media' | 'molta';
export type HikeLevel = 'leggera' | 'media' | 'impegnativa' | 'variabile';

export function osloDate(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Oslo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const value = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${value.year}-${value.month}-${value.day}`;
}

export function validSimulatedDate(value: string | null): string | null {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) ? value : null;
}

export function tripPhase(date: string): TripPhase {
  if (date < TRIP_DATES[0]) return 'before';
  if (date > TRIP_DATES.at(-1)!) return 'after';
  return 'during';
}

export function temporalState(dayDate: string, currentDate: string): TemporalState {
  if (dayDate < currentDate) return 'past';
  if (dayDate === currentDate) return 'today';
  return 'future';
}

export function targetDay(date: string): string {
  if (date <= TRIP_DATES[0]) return TRIP_DATES[0];
  if (date >= TRIP_DATES.at(-1)!) return TRIP_DATES.at(-1)!;
  return date;
}

export function dayProgress(date: string): number {
  const target = targetDay(date);
  return TRIP_DATES.indexOf(target) + 1;
}

export function daysUntilTrip(date: string): number {
  const current = Date.parse(`${date}T00:00:00Z`);
  const start = Date.parse(`${TRIP_DATES[0]}T00:00:00Z`);
  return Math.max(0, Math.round((start - current) / 86_400_000));
}

export function drivingLevel(minutes: number | null): DrivingLevel | null {
  if (minutes === null) return null;
  if (minutes <= 30) return 'zero';
  if (minutes <= 120) return 'poca';
  if (minutes <= 240) return 'media';
  return 'molta';
}

export function hikeLevel(hike?: { durationHours?: number; elevationGainM?: number }): HikeLevel | null {
  if (!hike) return null;
  const { durationHours, elevationGainM } = hike;
  if (durationHours === undefined && elevationGainM === undefined) return 'variabile';
  if ((durationHours ?? 0) >= 7 || (elevationGainM ?? 0) >= 1200) return 'impegnativa';
  if ((durationHours ?? 0) >= 4 || (elevationGainM ?? 0) >= 600) return 'media';
  return 'leggera';
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (!hours) return `${remainder}m`;
  return remainder ? `${hours}h ${remainder}m` : `${hours}h`;
}

export function countOpenTasks(markdown: string): number {
  return markdown.match(/^\s*[-*+]\s+\[ \]\s+/gim)?.length ?? 0;
}
