import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Select, MenuItem, Button, Typography, Box,
  Paper, Chip, IconButton, LinearProgress,Slider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import { tableCellClasses } from '@mui/material/TableCell';
import dayjs, { Dayjs } from 'dayjs';
import { addTask, updateMyTask, getAssignedTasks, project } from '@/services/api';
import { useAppContext } from '@/features/account/AppContext';



interface RowData {
  projectId: number;
  taskName: string;
  progress: string;
  priority: string;
  startDate: Dayjs | null;
  dueDate: Dayjs | null;
  assignees: string[];
  percentage: number;
  taskId: number;
  userId:number;
}

interface ProjectData {
  projectId: number;
  projectName: string;
  tasks: RowData[];
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 4,
  },
  height: '8px',
  minWidth:'180px'
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  height: '8px',
  overflow:'auto',
  
  // Adjusted height for all table rows
}));

const AssignedTask: React.FC = () => {
  const {user}=useAppContext();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [newAssignee, setNewAssignee] = useState<string>('');
  const [addingAssigneeIndex, setAddingAssigneeIndex] = useState<number | null>(null);

  useEffect(() => {
    // Fetching all projects and their tasks
    getAssignedTasks(user.email)
      .then(response => {
        console.log(response);
        console.log("my new projects",projects);
        const groupedTasks = response.projects.reduce((acc: ProjectData[], task: any) => {
          let project = acc.find((p) => p.projectId === task.id);
          if (!project) {
            project = {
              projectId: task.id,
              projectName: task.projectName,
              tasks: []
            }
            acc.push(project);
          }
          if(task.progress != 'completed'){
            project.tasks.push({
              projectId: task.id,
              taskName: task.taskName,
              progress: task.progress,
              priority: task.priority,
              startDate: task.startDate ? dayjs(task.startDate) : null,
              dueDate: task.dueDate ? dayjs(task.dueDate) : null,
              assignees: task.assignees || [],
              percentage: task.percentage,
              taskId: task.taskId,
              userId:Number(user.id)
            });
          }

          return acc;
        }, []);
        setProjects(groupedTasks);
      })
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const handleAddAssignee = (projectIndex: number, taskIndex: number) => {
    if (newAssignee.trim() !== '') {
      const updatedProjects = [...projects];
      updatedProjects[projectIndex].tasks[taskIndex].assignees.push(newAssignee.trim());
      updatedProjects[projectIndex].tasks[taskIndex].userId=Number(user.id);
      setProjects(updatedProjects);
      setNewAssignee('');
      setAddingAssigneeIndex(null);
      updateRowInDB(updatedProjects[projectIndex].tasks[taskIndex]);
    }
  };

  const handleProgressChange = (projectIndex: number, taskIndex: number, value: string) => {
    const updatedProjects = [...projects];
    updatedProjects[projectIndex].tasks[taskIndex].progress = value;
    setProjects(updatedProjects);
    updateRowInDB(updatedProjects[projectIndex].tasks[taskIndex]);
  };

  const handlePriorityChange = (projectIndex: number, taskIndex: number, value: string) => {
    const updatedProjects = [...projects];
    updatedProjects[projectIndex].tasks[taskIndex].priority = value;
    setProjects(updatedProjects);
    updateRowInDB(updatedProjects[projectIndex].tasks[taskIndex]);
  };

  const updateRowInDB = (row: RowData) => {
    updateMyTask(row)
      .then(response => console.log('Row updated:', response.data))
      .catch(error => console.error('Error updating row:', error));
  };

  const handleAddRow = (projectIndex: number) => {
    const newRow: RowData = {
      projectId: projects[projectIndex].projectId,
      taskName: '',
      progress: '',
      priority: '',
      startDate: null,
      dueDate: null,
      assignees: [],
      percentage: 0,
      taskId: 0,
      userId:Number(user.id)
    };

    addTask(newRow)
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
          percentage: addedTask.percentage,
          taskId: addedTask.taskid,
          userId:Number(user.id)
        };
        const updatedProjects = [...projects];
        updatedProjects[projectIndex].tasks.push(formattedTask);
        setProjects(updatedProjects);
      })
      .catch(error => console.error('Error adding row:', error));
  };

  const handleRemoveRow = (projectIndex: number, taskIndex: number) => {
    const updatedProjects = [...projects];
    
    

    
    updatedProjects[projectIndex].tasks[taskIndex].progress ="completed";
    updatedProjects[projectIndex].tasks[taskIndex].percentage=100;
    setProjects(updatedProjects);
    updateRowInDB(updatedProjects[projectIndex].tasks[taskIndex]);
   

    updatedProjects[projectIndex].tasks.splice(taskIndex, 1);
    setProjects(updatedProjects);

    // Play completion sound
    const audio = new Audio('./sounds/cmsound.mp3'); // Update with your sound file path
    audio.play();

    // Optionally, update the backend to remove the task if necessary
    
    
  };

  const handlePercentageChange = (projectIndex: number, taskIndex: number, value: number) => {
    const updatedProjects = [...projects];
    updatedProjects[projectIndex].tasks[taskIndex].percentage = value;
    setProjects(updatedProjects);
    updateRowInDB(updatedProjects[projectIndex].tasks[taskIndex]); // Call backend to update task
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ padding: 3 }}>
        {projects.map((project, projectIndex) => (
          <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }} key={project.projectId}>
            <Typography variant="h5" gutterBottom>{project.projectName}</Typography>
            <TableContainer component={Box} sx={{ maxHeight: '400px', overflowX: 'auto' }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Task Name</StyledTableCell>
                    <StyledTableCell>Start Date</StyledTableCell>
                    <StyledTableCell>Due Date</StyledTableCell>
                    <StyledTableCell>Progress</StyledTableCell>
                    <StyledTableCell>Priority</StyledTableCell>
                    {/* <StyledTableCell>Assignees</StyledTableCell> */}
                    <StyledTableCell>Percent</StyledTableCell>
                    <StyledTableCell>Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {project.tasks.map((task, taskIndex) => (
                    <StyledTableRow key={task.taskId}>
                      <StyledTableCell>
                        <TextField
                          value={task.taskName}
                          onChange={(event) => {
                            const updatedProjects = [...projects];
                            updatedProjects[projectIndex].tasks[taskIndex].taskName = event.target.value;
                            setProjects(updatedProjects);
                            updateRowInDB(updatedProjects[projectIndex].tasks[taskIndex]);
                          }}
                          fullWidth
                          variant="outlined"
                          placeholder="Enter task name"
                          disabled={true}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <DatePicker
                          value={task.startDate}
                          onChange={(date) => {
                            const updatedProjects = [...projects];
                            updatedProjects[projectIndex].tasks[taskIndex].startDate = date;
                            setProjects(updatedProjects);
                            updateRowInDB(updatedProjects[projectIndex].tasks[taskIndex]);
                          }}
                          format="DD/MM/YYYY"
                          // renderInput={(params) => <TextField {...params} fullWidth />}
                          // placeholder="Pick start date"
                          disabled={true}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <DatePicker
                          value={task.dueDate}
                          onChange={(date) => {
                            const updatedProjects = [...projects];
                            updatedProjects[projectIndex].tasks[taskIndex].dueDate = date;
                            setProjects(updatedProjects);
                            updateRowInDB(updatedProjects[projectIndex].tasks[taskIndex]);
                          }}
                          format="DD/MM/YYYY"
                          // renderInput={(params) => <TextField {...params} fullWidth />}
                          // placeholder="Pick due date"
                          disabled={true}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                      <Select
                      
                              fullWidth
                              value={task.progress}
                              onChange={(event) => handleProgressChange(projectIndex, taskIndex, event.target.value as string)}
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
                          <MenuItem value="in_progress" style={{ color: '#FF9800' }}>In Progress</MenuItem>
                          <MenuItem value="completed" style={{ color: '#4CAF50' }}>Completed</MenuItem>
                        </Select>
                      </StyledTableCell>
                      <StyledTableCell>
                      <Select
                              disabled={true}
                              fullWidth
                              value={task.priority}
                              onChange={(event) => handlePriorityChange(projectIndex, taskIndex, event.target.value as string)}
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
                          <MenuItem value="medium" style={{ color: '#FF9800' }}>Medium</MenuItem>
                          <MenuItem value="high" style={{ color: '#F44336' }}>High</MenuItem>
                        </Select>
                      </StyledTableCell>
                      {/* <StyledTableCell>
                        {task.assignees.map((assignee, index) => (
                          <Chip
                            key={index}
                            label={assignee}
                            sx={{ marginRight: 1, marginBottom: 1 }}
                            onDelete={() => {
                              const updatedProjects = [...projects];
                              updatedProjects[projectIndex].tasks[taskIndex].assignees.splice(index, 1);
                              setProjects(updatedProjects);
                              updateRowInDB(updatedProjects[projectIndex].tasks[taskIndex]);
                            }}
                          />
                        ))}
                        {addingAssigneeIndex === taskIndex ? (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TextField
                              value={newAssignee}
                              onChange={(e) => setNewAssignee(e.target.value)}
                              placeholder="Enter email"
                              variant="outlined"
                              size="small"
                              sx={{ marginRight: 1 }}
                            />
                            <Button onClick={() => handleAddAssignee(projectIndex, taskIndex)} variant="contained">Add</Button>
                          </Box>
                        ) : (
                          <IconButton onClick={() => setAddingAssigneeIndex(taskIndex)} color="primary">
                            <AddIcon />
                          </IconButton>
                        )}
                      </StyledTableCell> */}
                      <StyledTableCell>
                      <Box sx={{ width: '100%', mt: 2 }}>
                          <Typography variant="body1" gutterBottom>
                            Progress:{`${task.percentage}%`}
                          </Typography>
                          <Slider
                             
                            value={task.percentage}
                            onChange={(event, newValue) => handlePercentageChange(projectIndex, taskIndex, newValue as number)}
                            aria-labelledby="percentage-slider"
                            valueLabelDisplay="auto"
                            min={0}
                            max={100}
                            step={1}
                            sx={{ height: 10, borderRadius: 5 }}
                            
                          />
                          {/* Display the percentage value next to the slider */}
                          
                      </Box>
                      </StyledTableCell>
                      <StyledTableCell>
                        <IconButton
                          onClick={() => handleRemoveRow(projectIndex, taskIndex)}
                          color="success"
                        >
                          <CheckIcon />
                        </IconButton>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
          </Paper>
        ))}
      </Box>
    </LocalizationProvider>
  );
};

export default AssignedTask;
