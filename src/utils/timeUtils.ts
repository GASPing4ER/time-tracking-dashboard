// src/utils/timeUtils.ts
import { parseISO, format, differenceInMinutes } from "date-fns";

export const formatDuration = (start: string, end: string) => {
  const minutes = differenceInMinutes(parseISO(end), parseISO(start));
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

export const formatDate = (dateString: string) => {
  return format(parseISO(dateString), "PPpp");
};

export const getHoursFromMinutes = (minutes: number) => {
  return parseFloat((minutes / 60).toFixed(1));
};
