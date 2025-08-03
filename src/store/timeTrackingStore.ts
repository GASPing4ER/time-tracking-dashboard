// src/store/timeTrackingStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TimeTrackingState } from "../types";
import {
  fetchProjects,
  fetchTimeEntries,
  saveTimeEntry,
} from "../api/mockTimeTrackingApi";

const useTimeTrackingStore = create<TimeTrackingState>()(
  persist(
    (set, get) => ({
      timeEntries: [],
      projects: [
        { id: 1, name: "Website Redesign", color: "#FF6B6B" },
        { id: 2, name: "Mobile App", color: "#4ECDC4" },
        { id: 3, name: "Marketing Campaign", color: "#45B7D1" },
      ],
      loading: false,
      error: null,
      tags: ["Meeting", "Development", "Design", "Research", "Break"],
      activeTimer: null,
      filters: {
        project: null,
        tag: null,
        timeRange: "today",
      },
      darkMode: false,
      mobileOpen: false,

      loadInitialData: async () => {
        set({ loading: true });
        try {
          const [entries, projects] = await Promise.all([
            fetchTimeEntries(),
            fetchProjects(),
          ]);
          set({ timeEntries: entries, projects, loading: false });
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          set({ error: "Failed to load data", loading: false });
        }
      },

      addTimeEntry: async (entry) => {
        set({ loading: true });
        try {
          const newEntry = await saveTimeEntry(entry);
          set((state) => ({
            timeEntries: [newEntry, ...state.timeEntries],
            loading: false,
          }));
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          set({ error: "Failed to save entry", loading: false });
        }
      },

      startTimer: (projectId, taskName, tag) => {
        const now = new Date().toISOString();
        set({
          activeTimer: {
            projectId,
            taskName,
            tag,
            startTime: now,
          },
        });
      },

      stopTimer: () => {
        const { activeTimer } = get();
        if (!activeTimer) return;

        const now = new Date().toISOString();
        const newEntry = {
          projectId: activeTimer.projectId,
          taskName: activeTimer.taskName,
          tag: activeTimer.tag,
          startTime: activeTimer.startTime,
          endTime: now,
        };

        set((state) => ({
          timeEntries: [
            {
              ...newEntry,
              id: Date.now(),
              date: new Date().toISOString().split("T")[0],
            },
            ...state.timeEntries,
          ],
          activeTimer: null,
        }));
      },

      deleteTimeEntry: (id) => {
        set((state) => ({
          timeEntries: state.timeEntries.filter((entry) => entry.id !== id),
        }));
      },

      updateFilters: (filters) => {
        set({ filters: { ...get().filters, ...filters } });
      },

      toggleDarkMode: () => {
        set({ darkMode: !get().darkMode });
      },

      toggleMobileOpen: () => {
        set({ mobileOpen: !get().mobileOpen });
      },

      addProject: (project) => {
        const newProject = {
          ...project,
          id: get().projects.length + 1,
        };
        set((state) => ({
          projects: [...state.projects, newProject],
        }));
      },

      addTag: (tag) => {
        set((state) => ({
          tags: Array.from(new Set([...state.tags, tag])),
        }));
      },
    }),
    {
      name: "time-tracking-storage",
    }
  )
);

export default useTimeTrackingStore;
