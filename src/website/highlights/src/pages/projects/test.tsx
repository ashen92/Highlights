import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  TextField, Select, MenuItem, Button, Typography, Box, 
  Paper, Chip, Grid, IconButton,
  LinearProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { tableCellClasses } from '@mui/material/TableCell';
import dayjs, { Dayjs } from 'dayjs';
import {addTask ,updateMyTask,tasks,project} from '@/services/api'
import { useInputWrapperContext } from '@mantine/core';
import { useAppContext } from '@/features/account/AppContext';



interface RowData {
  projectId: number;
  taskName: string;
  progress: string;
  priority: string;
  startDate: Dayjs | null;
  dueDate: Dayjs | null;
  assignees: string[];
  percentage:number;
  taskId:number;
}

interface ProjectData {
  assignees: any;
  projectId: number;
  projectName: string;
  progress: string;
  priority: string;
  startDate: Dayjs | null;
  dueDate: Dayjs | null;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  minWidth:'180px'
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const Test: React.FC<{ projectId: number }> = ({ projectId }) => {

  const {user}=useAppContext();
  console.log("hey i am the user here");
  console.log("hey i am the user email here",user.email);

  const [projectDetails, setProjectDetails] = useState<ProjectData>({
    projectId: projectId,
    projectName: '',
    progress: '',
    priority: '',
    startDate: null,
    dueDate: null,
    assignees:null
  });
  const [rows, setRows] = useState<RowData[]>([]);
  const [newAssignee, setNewAssignee] = useState<string>('');
  const [addingAssigneeIndex, setAddingAssigneeIndex] = useState<number | null>(null);

  const priorityColors = {
    low: '#4CAF50',
    medium: '#FFC107',
    high: '#F44336'
  };

  const statusColors = {
    not_started: '#F44336',
    in_progress: '#FFC107',
    completed: '#4CAF50'
  };

  useEffect(() => {
    
    
    // axios.get(`http://localhost:9090/project/${projectId}`)
    project(projectId)
      .then(response => {
        console.log(response);
        const project = response.value;
        const fetchedProject: ProjectData = {
          projectId: project.projectId,
          projectName: project.projectName,
          progress: project.progress,
          priority: project.priority,
          startDate: project.startDate ? dayjs(project.startDate) : null,
          dueDate: project.dueDate ? dayjs(project.dueDate) : null,
          assignees:null
        };
        setProjectDetails(fetchedProject);
      })
      .catch(error => console.error('Error fetching project:', error));

      tasks(projectId)
      .then(response => {
        console.log(response);
        console.log("here are my tasks",response);
        const fetchedTasks = response.projects.map((task: any) => ({
          projectId: task.projectId,
          taskName: task.taskName,
          progress: task.progress,
          priority: task.priority,
          startDate: task.startDate ? dayjs(task.startDate) : null,
          dueDate: task.dueDate ? dayjs(task.dueDate) : null,
          assignees: task.assignees || [],
          percentage:task.percentage,
          taskId:task.taskId,
        }));
        setRows(fetchedTasks);
      })
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  // useEffect(() => {
  //   // axios.get(`http://localhost:9090/tasks/${projectId}`)
  //   tasks(projectId)
  //     .then(response => {
  //       console.log(response);
  //       console.log("here are my tasks",response);
  //       const fetchedTasks = response.projects.map((task: any) => ({
  //         projectId: task.projectId,
  //         taskName: task.taskName,
  //         progress: task.progress,
  //         priority: task.priority,
  //         startDate: task.startDate ? dayjs(task.startDate) : null,
  //         dueDate: task.dueDate ? dayjs(task.dueDate) : null,
  //         assignees: task.assignees || [],
  //         percentage:task.percentage,
  //         taskId:task.taskId,
  //       }));
  //       setRows(fetchedTasks);
  //     })
  //     .catch(error => console.error('Error fetching tasks:', error));
  // },[]);

  const handleAddAssignee = (index: number) => {
    if (newAssignee.trim() !== '') {
      const updatedRows = [...rows];
      updatedRows[index].assignees.push(newAssignee.trim());
      setRows(updatedRows);
      setNewAssignee('');
      setAddingAssigneeIndex(null);
      updateRowInDB(updatedRows[index]);
    }
  };

  const handleProgressChange = (index: number, value: string) => {
    const updatedRows = [...rows];
    updatedRows[index].progress = value;
    setRows(updatedRows);
    updateRowInDB(updatedRows[index]);
  };

  const handlePriorityChange = (index: number, value: string) => {
    const updatedRows = [...rows];
    updatedRows[index].priority = value;
    setRows(updatedRows);
    updateRowInDB(updatedRows[index]);
  };

  const updateRowInDB = (row: RowData) => {
    // axios.put(`http://localhost:9090/updateTask`, row)
    updateMyTask(row)
      .then(response => console.log('Row updated:', response.data))
      .catch(error => console.error('Error updating row:', error));
  };

  const handleAddRow = () => {
    const newRow: RowData = {
      projectId: projectId,
      taskName: '',
      progress: '',
      priority: '',
      startDate:null,
      dueDate: null,
      assignees: [],
      percentage:0,
      taskId:0
    };

    // axios.post('http://localhost:9090/addTask', 
    //      { projectId: projectId,
    //       taskName: '',
    //       progress: '',
    //       priority: '',
    //       startDate: '2001-01-21',
    //       dueDate: '2001-01-21',
    //       assignees: []}
    // )
    addTask(
      { 
      projectId: projectId,
      taskName: '',
      progress: '',
      priority: '',
      startDate: '2001-01-21',
      dueDate: '2001-01-21',
      assignees: [],
      percentage:0,},
    )
      .then(response => {
        console.log(response);
        const addedTask = response;
        const formattedTask: RowData = {
          projectId: addedTask.projectId,
          taskName: addedTask.taskName,
          progress: addedTask.progress,
          priority: addedTask.priority,
          startDate: addedTask.startDate ? dayjs(addedTask.startDate) : null,
          dueDate: addedTask.dueDate ? dayjs(addedTask.dueDate) : null,
          assignees: addedTask.assignees || [],
          percentage:addedTask.percentage,
          taskId:addedTask.taskid,
        };
        setRows([...rows, formattedTask]);
      })
      .catch(error => console.error('Error adding row:', error));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ padding: 3 }}>
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
          <Typography variant="h4" gutterBottom>Project Details</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1"><strong>Project Name:</strong> {projectDetails.projectName}</Typography>
              <Typography variant="subtitle1"><strong>Start Date:</strong> {projectDetails.startDate ? projectDetails.startDate.format('DD/MM/YYYY') : ''}</Typography>
              <Typography variant="subtitle1">
                <strong>Status:</strong> 
                <Chip 
                  label={projectDetails.progress} 
                  sx={{ backgroundColor: statusColors[projectDetails.progress as keyof typeof statusColors], color: 'white', marginLeft: 1 }}
                />
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1"><strong>Due Date:</strong> {projectDetails.dueDate ? projectDetails.dueDate.format('DD/MM/YYYY') : ''}</Typography>
              <Typography variant="subtitle1">
                <strong>Priority:</strong> 
                <Chip 
                  label={projectDetails.priority} 
                  sx={{ backgroundColor: priorityColors[projectDetails.priority as keyof typeof priorityColors], color: 'white', marginLeft: 1 }}
                />
              </Typography>
              {/* <Typography variant="subtitle1"><strong>Assignees:</strong> {projectDetails.assignees?.join(', ')}</Typography> */}
            </Grid>
          </Grid>
        </Paper>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h5" gutterBottom>Tasks</Typography>
          <TableContainer component={Box} sx={{ maxHeight: '400px', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Task Name</StyledTableCell>
                  <StyledTableCell>Start Date</StyledTableCell>
                  <StyledTableCell>Due Date</StyledTableCell>
                  <StyledTableCell>Progress</StyledTableCell>
                  <StyledTableCell>Priority</StyledTableCell>
                  <StyledTableCell>Assignees</StyledTableCell>
                  <StyledTableCell>Percent Completed</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, rowIndex) => (
                  <StyledTableRow key={row.taskName}>
                    <StyledTableCell>
                      <TextField
                        value={row.taskName}
                        onChange={(event) => {
                          const updatedRows = [...rows];
                          updatedRows[rowIndex].taskName = event.target.value;
                          setRows(updatedRows);
                          updateRowInDB(updatedRows[rowIndex]);
                        }}
                        fullWidth
                        variant="outlined"
                        placeholder="Enter task name"
                        sx={{ marginRight: '8px' }}
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <DatePicker
                        value={row.startDate}
                        onChange={(date) => {
                          const updatedRows = [...rows];
                          updatedRows[rowIndex].startDate = date;
                          setRows(updatedRows);
                          updateRowInDB(updatedRows[rowIndex]);
                        }}
                        minDate={dayjs()}
                        format="DD/MM/YYYY"
                        // renderInput={(params) => <TextField {...params} fullWidth />}
                        // placeholder="Pick start date"
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <DatePicker
                        value={row.dueDate}
                        onChange={(date) => {
                          const updatedRows = [...rows];
                          updatedRows[rowIndex].dueDate = date;
                          setRows(updatedRows);
                          updateRowInDB(updatedRows[rowIndex]);
                        }}
                        minDate={dayjs()}
                        format="DD/MM/YYYY"
                        // renderInput={(params) => <TextField {...params} fullWidth />}
                        // placeholder="Pick due date"
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                    <Select
                              fullWidth
                              value={row.progress}
                              onChange={(event) => handleProgressChange(rowIndex, event.target.value as string)}
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    maxHeight: 300,
                                  },
                                },
                              }}
                              // Render the selected value with color
                              renderValue={(selected) => {
                                let color = '';
                                switch (selected) {
                                  case 'not_started':
                                    color = '#F44336'; // Red
                                    break;
                                  case 'in_progress':
                                    color = '#FF9800'; // Orange
                                    break;
                                  case 'completed':
                                    color = '#4CAF50'; // Green
                                    break;
                                  default:
                                    color = 'inherit'; // Default color
                                }

                                return (
                                  <span style={{ color: color }}>
                                    {selected === 'not_started' && 'Not Started'}
                                    {selected === 'in_progress' && 'In Progress'}
                                    {selected === 'completed' && 'Completed'}
                                  </span>
                                );
                              }}
                            >
                        <MenuItem value="not_started" style={{ color: '#F44336' }}>Not Started</MenuItem>
                        <MenuItem value="in_progress" style={{ color: '#FFC107' }}>In Progress</MenuItem>
                        <MenuItem value="completed" style={{ color: '#4CAF50' }}>Completed</MenuItem>
                      </Select>
                    </StyledTableCell>
                    <StyledTableCell>
                    <Select
                              fullWidth
                              value={row.priority}
                              onChange={(event) => handlePriorityChange(rowIndex, event.target.value as string)}
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    maxHeight: 300,
                                  },
                                },
                              }}
                              // Render the selected value with color
                              renderValue={(selected) => {
                                let color = '';
                                switch (selected) {
                                  case 'high':
                                    color = '#F44336'; // Red
                                    break;
                                  case 'low':
                                    color = '#FF9800'; // Orange
                                    break;
                                  case 'medium':
                                    color = '#4CAF50'; // Green
                                    break;
                                  default:
                                    color = 'inherit'; // Default color
                                }

                                return (
                                  <span style={{ color: color }}>
                                    {selected === 'low' && 'Low'}
                                    {selected === 'medium' && 'Medium'}
                                    {selected === 'high' && 'High'}
                                  </span>
                                );
                              }}
                            >
                        <MenuItem value="low" style={{ color: '#4CAF50' }}>Low</MenuItem>
                        <MenuItem value="medium" style={{ color: '#FFC107' }}>Medium</MenuItem>
                        <MenuItem value="high" style={{ color: '#F44336' }}>High</MenuItem>
                      </Select>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Box display="flex" alignItems="center">
                        <Box flexGrow={1}>
                          {row.assignees.map((assignee, index) => (
                            <Chip key={index} label={assignee} style={{ marginRight: 5 }} />
                          ))}
                        </Box>
                        <IconButton
                          color="primary"
                          onClick={() => setAddingAssigneeIndex(rowIndex === addingAssigneeIndex ? null : rowIndex)}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                      {addingAssigneeIndex === rowIndex && (
                        <Box mt={2}>
                          <TextField
                            value={newAssignee}
                            onChange={(e) => setNewAssignee(e.target.value)}
                            placeholder="Enter assignee email"
                            variant="outlined"
                            fullWidth
                          />
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleAddAssignee(rowIndex)}
                            style={{ marginTop: 5 }}
                          >
                            Add Assignee
                          </Button>
                        </Box>
                      )}
                    </StyledTableCell>
                    <StyledTableCell>
                      <Box sx={{ width: '100%', mt: 2 }}>
                          <Typography variant="body1" gutterBottom>
                              Progress: {row.percentage}%
                          </Typography>
                          <LinearProgress 
                              variant="determinate" 
                              value={row.percentage} 
                              sx={{ height: 10, borderRadius: 5 }} 
                          />
                      </Box>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box mt={2} textAlign="center">
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddRow}>
              Add Task
            </Button>
          </Box>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default Test;
