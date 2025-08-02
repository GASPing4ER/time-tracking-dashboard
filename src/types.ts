// src/types.ts
export interface TimeEntry {
  id: number;
  projectId: number;
  taskName: string;
  tag: string;
  startTime: string;
  endTime: string;
  date?: string;
}

export interface Project {
  id: number;
  name: string;
  color: string;
}

export interface Filters {
  project: number | null;
  tag: string | null;
  timeRange: "today" | "week" | "month" | "all";
}

export interface TimeTrackingState {
  timeEntries: TimeEntry[];
  projects: Project[];
  tags: string[];
  activeTimer: {
    projectId: number;
    taskName: string;
    tag: string;
    startTime: string;
  } | null;
  filters: Filters;
  darkMode: boolean;
  mobileOpen: boolean;
  addTimeEntry: (entry: Omit<TimeEntry, "id" | "date">) => void;
  startTimer: (projectId: number, taskName: string, tag: string) => void;
  stopTimer: () => void;
  deleteTimeEntry: (id: number) => void;
  updateFilters: (filters: Partial<Filters>) => void;
  toggleDarkMode: () => void;
  toggleMobileOpen: () => void;
  addProject: (project: Omit<Project, "id">) => void;
  addTag: (tag: string) => void;
}
