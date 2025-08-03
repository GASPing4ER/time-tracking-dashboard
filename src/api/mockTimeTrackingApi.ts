import { startOfWeek, addDays } from "date-fns";
import type { Project, TimeEntry } from "../types";

const MOCK_DELAY = 500;

const mockProjects: Project[] = [
  { id: 1, name: "Website Redesign", color: "#FF6B6B" },
  { id: 2, name: "Mobile App", color: "#4ECDC4" },
  { id: 3, name: "Marketing Campaign", color: "#45B7D1" },
];

const getCurrentWeekDay = (dayOffset: number, hours: number, minutes = 0) => {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  const date = addDays(weekStart, dayOffset);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

const mockTimeEntries: TimeEntry[] = [
  // Monday 9:00-11:00 AM
  {
    id: 1,
    projectId: 1,
    taskName: "Homepage redesign",
    tag: "Design",
    startTime: getCurrentWeekDay(0, 9), // Monday 9AM
    endTime: getCurrentWeekDay(0, 11), // Monday 11AM
  },
  // Tuesday 1:00-3:30 PM
  {
    id: 2,
    projectId: 2,
    taskName: "API integration",
    tag: "Development",
    startTime: getCurrentWeekDay(1, 13), // Tuesday 1PM
    endTime: getCurrentWeekDay(1, 15, 30), // Tuesday 3:30PM
  },
  // Wednesday 9:00-11:30 AM
  {
    id: 3,
    projectId: 3,
    taskName: "Marketing strategy",
    tag: "Meeting",
    startTime: getCurrentWeekDay(2, 9), // Wednesday 9AM
    endTime: getCurrentWeekDay(2, 11, 30), // Wednesday 11:30AM
  },
  // Thursday 12:00-2:00 PM
  {
    id: 4,
    projectId: 1,
    taskName: "Mobile responsiveness",
    tag: "Development",
    startTime: getCurrentWeekDay(3, 12), // Thursday 12PM
    endTime: getCurrentWeekDay(3, 14), // Thursday 2PM
  },
  // Friday 8:30-9:30 AM
  {
    id: 5,
    projectId: 2,
    taskName: "Daily standup",
    tag: "Meeting",
    startTime: getCurrentWeekDay(4, 8, 30), // Friday 8:30AM
    endTime: getCurrentWeekDay(4, 9, 30), // Friday 9:30AM
  },
];

export const fetchTimeEntries = (): Promise<TimeEntry[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockTimeEntries), MOCK_DELAY);
  });
};

export const fetchProjects = (): Promise<Project[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockProjects), MOCK_DELAY);
  });
};

export const saveTimeEntry = (
  entry: Omit<TimeEntry, "id">
): Promise<TimeEntry> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newEntry = {
        ...entry,
        id: Date.now(),
      };
      resolve(newEntry);
    }, MOCK_DELAY);
  });
};
