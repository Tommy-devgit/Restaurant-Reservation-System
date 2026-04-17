import type { TimeSlot, WorkingHours } from "@/types/domain";

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (totalMinutes % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function hasTimeConflict(
  newStart: string,
  newEnd: string,
  existingStart: string,
  existingEnd: string,
): boolean {
  const newStartMin = timeToMinutes(newStart);
  const newEndMin = timeToMinutes(newEnd);
  const existingStartMin = timeToMinutes(existingStart);
  const existingEndMin = timeToMinutes(existingEnd);

  return newStartMin < existingEndMin && newEndMin > existingStartMin;
}

export function generateTimeSlots(
  workingHours: WorkingHours,
  slotMinutes = 90,
): TimeSlot[] {
  const open = timeToMinutes(workingHours.open);
  const close = timeToMinutes(workingHours.close);

  const slots: TimeSlot[] = [];
  let cursor = open;

  while (cursor + slotMinutes <= close) {
    slots.push({
      startTime: minutesToTime(cursor),
      endTime: minutesToTime(cursor + slotMinutes),
    });
    cursor += slotMinutes;
  }

  return slots;
}
