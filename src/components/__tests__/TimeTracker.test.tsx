// src/components/__tests__/TimeTracker.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TimeTracker from "../TimeTracker";
import useTimeTrackingStore from "../../store/timeTrackingStore";
import "@testing-library/jest-dom";

// Mock the store
jest.mock("../../store/timeTrackingStore");

const mockUseTimeTrackingStore = useTimeTrackingStore as jest.MockedFunction<
  typeof useTimeTrackingStore
>;

describe("TimeTracker Component", () => {
  const mockProjects = [
    { id: 1, name: "Website Redesign", color: "#FF6B6B" },
    { id: 2, name: "Mobile App", color: "#4ECDC4" },
  ];

  const mockTags = ["Development", "Design", "Meeting"];

  beforeEach(() => {
    mockUseTimeTrackingStore.mockReturnValue({
      projects: mockProjects,
      tags: mockTags,
      activeTimer: null,
      startTimer: jest.fn(),
      stopTimer: jest.fn(),
      addTimeEntry: jest.fn().mockResolvedValue({}),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the component with initial state", () => {
    render(<TimeTracker />);

    expect(screen.getByText("Track Time")).toBeInTheDocument();
    expect(screen.getByText("Timer")).toBeInTheDocument();
    expect(screen.getByText("Manual Entry")).toBeInTheDocument();
    expect(screen.getByLabelText("Project")).toBeInTheDocument();
    expect(screen.getByLabelText("Task Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Tag")).toBeInTheDocument();
    expect(screen.getByText("Start Timer")).toBeInTheDocument();
  });

  test("switches between timer and manual entry tabs", () => {
    render(<TimeTracker />);

    const manualTab = screen.getByText("Manual Entry");
    fireEvent.click(manualTab);

    expect(screen.getByText("Add Time Entry")).toBeInTheDocument();
    expect(screen.queryByText("Start Timer")).not.toBeInTheDocument();
  });

  test("starts timer with valid input", () => {
    const mockStartTimer = jest.fn();
    mockUseTimeTrackingStore.mockReturnValue({
      projects: mockProjects,
      tags: mockTags,
      activeTimer: null,
      startTimer: mockStartTimer,
      stopTimer: jest.fn(),
      addTimeEntry: jest.fn(),
    });

    render(<TimeTracker />);

    const taskInput = screen.getByLabelText("Task Name");
    fireEvent.change(taskInput, { target: { value: "New Task" } });

    const startButton = screen.getByText("Start Timer");
    fireEvent.click(startButton);

    expect(mockStartTimer).toHaveBeenCalledWith(1, "New Task", mockTags[0]);
  });

  test("does not start timer with empty task name", () => {
    const mockStartTimer = jest.fn();
    mockUseTimeTrackingStore.mockReturnValue({
      projects: mockProjects,
      tags: mockTags,
      activeTimer: null,
      startTimer: mockStartTimer,
      stopTimer: jest.fn(),
      addTimeEntry: jest.fn(),
    });

    render(<TimeTracker />);

    const startButton = screen.getByText("Start Timer");
    fireEvent.click(startButton);

    expect(mockStartTimer).not.toHaveBeenCalled();
    expect(startButton).toBeDisabled();
  });

  test("displays active timer and stop button", () => {
    const mockActiveTimer = {
      projectId: 1,
      taskName: "Active Task",
      tag: "Development",
      startTime: new Date().toISOString(),
    };

    mockUseTimeTrackingStore.mockReturnValue({
      projects: mockProjects,
      tags: mockTags,
      activeTimer: mockActiveTimer,
      startTimer: jest.fn(),
      stopTimer: jest.fn(),
      addTimeEntry: jest.fn(),
    });

    render(<TimeTracker />);

    expect(screen.getByText("Tracking: Active Task")).toBeInTheDocument();
    expect(screen.getByText("Stop Timer")).toBeInTheDocument();
  });

  test("stops active timer", () => {
    const mockStopTimer = jest.fn();
    const mockActiveTimer = {
      projectId: 1,
      taskName: "Active Task",
      tag: "Development",
      startTime: new Date().toISOString(),
    };

    mockUseTimeTrackingStore.mockReturnValue({
      projects: mockProjects,
      tags: mockTags,
      activeTimer: mockActiveTimer,
      startTimer: jest.fn(),
      stopTimer: mockStopTimer,
      addTimeEntry: jest.fn(),
    });

    render(<TimeTracker />);

    const stopButton = screen.getByText("Stop Timer");
    fireEvent.click(stopButton);

    expect(mockStopTimer).toHaveBeenCalled();
  });

  test("opens manual entry dialog", () => {
    render(<TimeTracker />);

    // Switch to manual tab
    fireEvent.click(screen.getByText("Manual Entry"));

    const taskInput = screen.getByLabelText("Task Name");
    fireEvent.change(taskInput, { target: { value: "Manual Task" } });

    const addButton = screen.getByText("Add Time Entry");
    fireEvent.click(addButton);

    expect(screen.getByText("Add Manual Time Entry")).toBeInTheDocument();
  });

  test("submits manual time entry", async () => {
    const mockAddTimeEntry = jest.fn().mockResolvedValue({});
    mockUseTimeTrackingStore.mockReturnValue({
      projects: mockProjects,
      tags: mockTags,
      activeTimer: null,
      startTimer: jest.fn(),
      stopTimer: jest.fn(),
      addTimeEntry: mockAddTimeEntry,
    });

    render(<TimeTracker />);

    // Switch to manual tab
    fireEvent.click(screen.getByText("Manual Entry"));

    // Enter task name
    const taskInput = screen.getByLabelText("Task Name");
    fireEvent.change(taskInput, { target: { value: "Manual Task" } });

    // Open dialog
    const addButton = screen.getByText("Add Time Entry");
    fireEvent.click(addButton);

    // Wait for dialog to open
    await waitFor(() => {
      expect(screen.getByText("Add Manual Time Entry")).toBeInTheDocument();
    });

    // Submit the form
    const saveButton = screen.getByText("Save Entry");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockAddTimeEntry).toHaveBeenCalled();
    });
  });

  test("formats time correctly", () => {
    render(<TimeTracker />);

    // When active timer is present, it should show formatted time
    const mockActiveTimer = {
      projectId: 1,
      taskName: "Active Task",
      tag: "Development",
      startTime: new Date(Date.now() - 3661000).toISOString(), // 1 hour, 1 minute, 1 second ago
    };

    mockUseTimeTrackingStore.mockReturnValue({
      projects: mockProjects,
      tags: mockTags,
      activeTimer: mockActiveTimer,
      startTimer: jest.fn(),
      stopTimer: jest.fn(),
      addTimeEntry: jest.fn(),
    });

    render(<TimeTracker />);

    expect(screen.getByText(/01:01:01/)).toBeInTheDocument();
  });

  test("disables manual entry button when task name is empty", () => {
    render(<TimeTracker />);

    // Switch to manual tab
    fireEvent.click(screen.getByText("Manual Entry"));

    const addButton = screen.getByText("Add Time Entry");
    expect(addButton).toBeDisabled();
  });
});
