import type { Project, TimeEntry } from "../types";

const MOCK_DELAY = 500;

const mockProjects: Project[] = [
  { id: 1, name: "Website Redesign", color: "#FF6B6B" },
  { id: 2, name: "Mobile App", color: "#4ECDC4" },
  { id: 3, name: "Marketing Campaign", color: "#45B7D1" },
];

const mockTimeEntries: TimeEntry[] = [
  {
    id: 1,
    projectId: 1,
    taskName: "Homepage layout",
    tag: "Design",
    startTime: new Date(Date.now() - 86400000).toISOString(),
    endTime: new Date(Date.now() - 86400000 + 7200000).toISOString(),
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
        id: Math.max(...mockTimeEntries.map((e) => e.id)) + 1,
      };
      mockTimeEntries.unshift(newEntry);
      resolve(newEntry);
    }, MOCK_DELAY);
  });
};
