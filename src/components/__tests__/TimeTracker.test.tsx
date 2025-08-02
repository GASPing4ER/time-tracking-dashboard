// src/components/__tests__/TimeTracker.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import TimeTracker from "../TimeTracker";
import { describe, it, expect, vi } from "vitest";
import useTimeTrackingStore from "../../store/timeTrackingStore";

// Mock the Zustand store
vi.mock("../../store/timeTrackingStore");

describe("TimeTracker Component", () => {
  it("renders and allows starting a timer", () => {
    const mockStartTimer = vi.fn();
    const mockStopTimer = vi.fn();

    (useTimeTrackingStore as unknown as vi.Mock).mockImplementation(
      (selector) => {
        const state = {
          activeTimer: null,
          projects: [{ id: 1, name: "Test Project" }],
          tags: ["Development"],
          startTimer: mockStartTimer,
          stopTimer: mockStopTimer,
        };
        return selector(state);
      }
    );

    render(<TimeTracker />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/task name/i), {
      target: { value: "Test Task" },
    });

    // Click start button
    fireEvent.click(screen.getByText(/start timer/i));

    expect(mockStartTimer).toHaveBeenCalledWith(1, "Test Task", "Development");
  });

  it("shows stop button when timer is active", () => {
    (useTimeTrackingStore as unknown as vi.Mock).mockImplementation(
      (selector) => {
        const state = {
          activeTimer: {
            projectId: 1,
            taskName: "Test",
            tag: "Dev",
            startTime: "2023-01-01",
          },
          projects: [],
          tags: [],
          startTimer: vi.fn(),
          stopTimer: vi.fn(),
        };
        return selector(state);
      }
    );

    render(<TimeTracker />);
    expect(screen.getByText(/stop timer/i)).toBeInTheDocument();
  });
});
