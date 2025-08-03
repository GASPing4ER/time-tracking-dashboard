// src/components/TimeLogTable.tsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Chip,
  Box,
  TableFooter,
  TablePagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import useTimeTrackingStore from "../store/timeTrackingStore";
import { format, parseISO, differenceInSeconds } from "date-fns";

const TimeLogTable: React.FC = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const { timeEntries, projects, filters, deleteTimeEntry } =
    useTimeTrackingStore();

  const filteredEntries = timeEntries.filter((entry) => {
    // Filter by project
    if (filters.project && entry.projectId !== filters.project) return false;

    // Filter by tag
    if (filters.tag && entry.tag !== filters.tag) return false;

    // Filter by time range
    const entryDate = parseISO(entry.startTime);
    const now = new Date();

    if (filters.timeRange === "today") {
      return (
        entryDate.getDate() === now.getDate() &&
        entryDate.getMonth() === now.getMonth() &&
        entryDate.getFullYear() === now.getFullYear()
      );
    }

    if (filters.timeRange === "week") {
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      return entryDate >= startOfWeek;
    }

    if (filters.timeRange === "month") {
      return (
        entryDate.getMonth() === now.getMonth() &&
        entryDate.getFullYear() === now.getFullYear()
      );
    }

    return true;
  });

  // const emptyRows =
  //   page > 0
  //     ? Math.max(0, (1 + page) * rowsPerPage - filteredEntries.length)
  //     : 0;

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getProjectById = (id: number) => {
    return projects.find((project) => project.id === id);
  };

  const formatDuration = (start: string, end: string) => {
    const seconds = differenceInSeconds(parseISO(end), parseISO(start));
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Time Entries
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Project</TableCell>
              <TableCell>Task</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Tag</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEntries.length === 0 || rowsPerPage === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No time entries found
                </TableCell>
              </TableRow>
            ) : (
              filteredEntries
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((entry) => {
                  const project = getProjectById(entry.projectId);
                  return (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <Chip
                          label={project?.name || "Unknown"}
                          sx={{ backgroundColor: project?.color || "#ccc" }}
                        />
                      </TableCell>
                      <TableCell>{entry.taskName}</TableCell>
                      <TableCell>
                        {format(parseISO(entry.startTime), "PPpp")}
                      </TableCell>
                      <TableCell>
                        {format(parseISO(entry.endTime), "PPpp")}
                      </TableCell>
                      <TableCell>
                        {formatDuration(entry.startTime, entry.endTime)}
                      </TableCell>
                      <TableCell>
                        <Chip label={entry.tag} variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => deleteTimeEntry(entry.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={3}
                count={filteredEntries.length}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                  select: {
                    "aria-label": "rows per page",
                  },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TimeLogTable;
