import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Select, MenuItem, Button, Typography, Box, Avatar } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Autocomplete from '@mui/material/Autocomplete';
import { Divider } from '@mantine/core';
import { getProjectDetails } from '@/services/api'

const SideDrawer: React.FC = () => {
    const [projectDetails, setProjectDetails] = useState({
        projectName: '',
        projectDescription: '',
        startDate: '',
        dueDate: '',
        assignees: '',
        status: '',
        priority: ''
    });
    const [progress, setProgress] = useState('');
    const [assignees, setAssignees] = useState<string[]>([]);
    const [newAssignee, setNewAssignee] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false); // State for drawer open/close
    const [tableRows, setTableRows] = useState<number[]>([0]); // Array to manage dynamic table rows

    useEffect(() => {
        // Fetch project details from the API
        // axios.get('http://localhost:9090/project-details')
        getProjectDetails()
            .then(response => {
                setProjectDetails(response.data);
            })
            .catch(error => {
                console.error('Error fetching project details:', error);
            });
    }, []);

    const handleProgressChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setProgress(event.target.value as string);
    };

    const handleAddAssignee = () => {
        if (newAssignee.trim() !== '') {
            setAssignees([...assignees, newAssignee.trim()]);
            setNewAssignee('');
        }
    };

    const toggleAssigneeDisplay = (index: number) => {
        const updatedAssignees = [...assignees];
        updatedAssignees[index] = updatedAssignees[index].startsWith('@') ? updatedAssignees[index].substring(1) : `@${updatedAssignees[index]}`;
        setAssignees(updatedAssignees);
    };

    const handleProjectNameClick = () => {
        // Open the drawer when project name is clicked
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        // Close the drawer
        setDrawerOpen(false);
    };

    const handleAddRow = () => {
        setTableRows([...tableRows, tableRows.length]);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ padding: 2 }}>
                {/* Project Details Section */}
                <Box mb={2}>
                    {/* <Typography variant="h6">Project Details</Typography> */}
                    <Typography variant="subtitle1"><strong>Project Name:</strong> {projectDetails.projectName}</Typography>
                    <Typography variant="subtitle1"><strong>Project Description:</strong> {projectDetails.projectDescription}</Typography>
                    {/* <Typography variant="subtitle1"><strong>Assignees:</strong> {projectDetails.assignees}</Typography> */}
                    <Typography variant="subtitle1"><strong>Start Date:</strong> {projectDetails.startDate}</Typography>
                    <Typography variant="subtitle1"><strong>Due Date:</strong> {projectDetails.dueDate}</Typography>
                    <Typography variant="subtitle1"><strong>Status:</strong> {projectDetails.status}</Typography>
                    <Typography variant="subtitle1"><strong>Priority:</strong> {projectDetails.priority}</Typography>
                </Box>
                <Divider my="md" />

                {/* Tasks Table */}
                <TableContainer component={Box} sx={{ maxHeight: '400px', overflowX: 'auto' }}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ cursor: 'pointer', padding: '8px' }}>Project Name</TableCell>
                                <TableCell style={{ padding: '8px' }}>Start Date</TableCell>
                                <TableCell style={{ padding: '8px' }}>Due Date</TableCell>
                                <TableCell style={{ padding: '8px' }}>Assignees</TableCell>
                                <TableCell style={{ padding: '8px' }}>Status</TableCell>
                                <TableCell style={{ padding: '8px' }}>Percent Completed</TableCell>
                                <TableCell style={{ padding: '8px' }}>Priority</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableRows.map((rowIndex) => (
                                <TableRow key={rowIndex} style={{ height: '40px' }}>
                                    <TableCell style={{ padding: '8px' }}>
                                        {/* Use Autocomplete for project name */}
                                        <Autocomplete
                                            freeSolo
                                            options={['Project A', 'Project B', 'Project C']} // Replace with your actual project names or data
                                            renderInput={(params) => <TextField {...params} onClick={handleProjectNameClick} fullWidth variant="outlined" />}
                                        />
                                    </TableCell>
                                    <TableCell style={{ padding: '8px' }}>
                                        <DatePicker
                                            value={null}
                                            onChange={() => { }}
                                            // inputFormat="DD/MM/YYYY"
                                            // renderInput={(params) => <TextField {...params} fullWidth />}
                                            // placeholder="Pick start date"
                                            sx={{ width: '100%' }}
                                        />
                                    </TableCell>
                                    <TableCell style={{ padding: '8px' }}>
                                        <DatePicker
                                            value={null}
                                            onChange={() => { }}
                                            // inputFormat="DD/MM/YYYY"
                                            // renderInput={(params) => <TextField {...params} fullWidth />}
                                            // placeholder="Pick due date"
                                            sx={{ width: '100%' }}
                                        />
                                    </TableCell>
                                    <TableCell style={{ padding: '8px' }}>
                                        {/* Display assignees with initials */}
                                        {assignees.map((assignee, index) => (
                                            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}>
                                                <Avatar
                                                    sx={{ bgcolor: '#3f51b5', width: 30, height: 30, marginRight: 10, cursor: 'pointer' }}
                                                    onClick={() => toggleAssigneeDisplay(index)}
                                                >
                                                    {assignee.charAt(0).toUpperCase()}
                                                </Avatar>
                                                <Typography onClick={() => toggleAssigneeDisplay(index)} style={{ cursor: 'pointer' }}>{assignee}</Typography>
                                            </div>
                                        ))}
                                        {/* Autocomplete for adding new assignees */}
                                        <Autocomplete
                                            freeSolo
                                            value={newAssignee}
                                            onChange={(event, value) => setNewAssignee(value ?? '')}
                                            options={['assignee1@example.com', 'assignee2@example.com', 'assignee3@example.com']} // Replace with your assignee options or fetch dynamically
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    onClick={() => setNewAssignee('')} // Clear newAssignee on click to show options
                                                    placeholder="Add assignee email"
                                                    fullWidth
                                                    variant="outlined"
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        endAdornment: (
                                                            <Button
                                                                onClick={handleAddAssignee}
                                                                variant="contained"
                                                                disableElevation
                                                                size="small"
                                                            >
                                                                Add
                                                            </Button>
                                                        ),
                                                    }}
                                                />
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell style={{ padding: '8px' }}>
                                        <Select
                                            fullWidth
                                            value={progress}
                                            onChange={() => handleProgressChange}
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 300,
                                                    },
                                                },
                                            }}
                                        >
                                            <MenuItem value="not_started" style={{ color: '#F44336' }}>Not Started</MenuItem>
                                            <MenuItem value="in_progress" style={{ color: '#FFC107' }}>In Progress</MenuItem>
                                            <MenuItem value="completed" style={{ color: '#4CAF50' }}>Completed</MenuItem>
                                        </Select>
                                    </TableCell>
                                    <TableCell style={{ padding: '8px' }}>

                                    </TableCell>
                                    <TableCell style={{ padding: '8px' }}>
                                        <Select
                                            fullWidth
                                            value={progress}
                                            onChange={() => handleProgressChange}
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 300,
                                                    },
                                                },
                                            }}
                                        >
                                            <MenuItem value="low" style={{ color: '#F44336' }}>Low</MenuItem>
                                            <MenuItem value="medium" style={{ color: '#FFC107' }}>Medium</MenuItem>
                                            <MenuItem value="high" style={{ color: '#4CAF50' }}>High</MenuItem>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Add more button */}
                <Box mt={2} textAlign="center">
                    <Button variant="contained" onClick={handleAddRow}>Add More</Button>
                </Box>
            </Box>
        </LocalizationProvider>
    );
};

export default SideDrawer;
