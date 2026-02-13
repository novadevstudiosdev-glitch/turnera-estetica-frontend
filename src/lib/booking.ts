export type LocationKey = 'rosario' | 'correa';

type DaySchedule = {
  start: string;
  end: string;
};

const WEEKDAY_LABELS = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
const SLOT_MINUTES = 30;

export const LOCATIONS: { id: LocationKey; label: string }[] = [
  { id: 'rosario', label: 'Rosario' },
  { id: 'correa', label: 'Correa' },
];

export const AVAILABILITY: Record<LocationKey, Record<number, DaySchedule>> = {
  rosario: {
    1: { start: '14:00', end: '19:30' },
    4: { start: '08:00', end: '15:00' },
    5: { start: '08:00', end: '14:00' },
  },
  correa: {
    2: { start: '07:00', end: '16:00' },
  },
};

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const toTime = (minutesTotal: number) => {
  const hours = Math.floor(minutesTotal / 60);
  const minutes = minutesTotal % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

export const getDayIndex = (dateValue: string) => {
  if (!dateValue) return -1;
  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) return -1;
  return date.getDay();
};

export const isDateAvailable = (location: LocationKey, dateValue: string) => {
  const dayIndex = getDayIndex(dateValue);
  if (dayIndex < 0) return false;
  return Boolean(AVAILABILITY[location][dayIndex]);
};

export const getAvailableDaysLabel = (location: LocationKey) => {
  const dayIndices = Object.keys(AVAILABILITY[location])
    .map((value) => Number(value))
    .sort((a, b) => a - b);
  return dayIndices.map((index) => WEEKDAY_LABELS[index]).join(', ');
};

export const getTimeSlots = (location: LocationKey, dateValue: string) => {
  const dayIndex = getDayIndex(dateValue);
  if (dayIndex < 0) return [];
  const schedule = AVAILABILITY[location][dayIndex];
  if (!schedule) return [];
  const startMinutes = toMinutes(schedule.start);
  const endMinutes = toMinutes(schedule.end);
  const slots: string[] = [];

  for (let minutes = startMinutes; minutes + SLOT_MINUTES <= endMinutes; minutes += SLOT_MINUTES) {
    slots.push(toTime(minutes));
  }

  return slots;
};
