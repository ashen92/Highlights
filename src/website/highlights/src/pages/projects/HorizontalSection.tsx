import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Select, MenuItem, Button, Typography, Drawer, Box, Avatar } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Autocomplete from '@mui/material/Autocomplete';
import SideDrawer from './SideDrawer';
import Test from './test';
import dayjs, { Dayjs } from 'dayjs';
import { getProjects, addProjects, updateProject } from '@/services/api'

interface RowData {
    id: number;
    projectName: string;
    progress: string;
    priority: string;
    startDate: Dayjs | null;
    dueDate: Dayjs | null;
}

const HorizontalSection: React.FC = () => {
    const [rows, setRows] = useState<RowData[]>([]);
    const [newAssignee, setNewAssignee] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

    useEffect(() => {
        getProjects()
            // axios.get('http://localhost:9090/projects')
            .then(response => {
                const fetchedProjects = response.data.projects.map((project: any) => ({
                    id: project.id,
                    projectName: project.projectName,
                    progress: project.progress,
                    priority: project.priority,
                    startDate: project.startDate ? dayjs(project.startDate) : null,
                    dueDate: project.dueDate ? dayjs(project.dueDate) : null,
                }));
                setRows(fetchedProjects);
            })
            .catch(error => console.error('Error fetching projects:', error));
    }, []);

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

    const handleProjectNameClick = (projectId: number) => {
        setSelectedProjectId(projectId);
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
    };

    const handleAddRow = () => {
        const newRow: RowData = {
            id: 0,
            projectName: '',
            progress: '',
            priority: '',
            startDate: null,
            dueDate: null,
        };

        // axios.post('http://localhost:9090/addProjects', {
        //     id: 10,
        //     projectName: 'New Project',
        //     progress: 'completed',
        //     priority: 'low',
        //     startDate: '2001-01-25',
        //     dueDate: '2001-02-25',
        // })
        addProjects({
            id: 10,
            projectName: 'New Project',
            progress: 'completed',
            priority: 'low',
            startDate: '2001-01-25',
            dueDate: '2001-02-25',
        })
            .then(response => {
                console.log('New row added:', response.projects);
                const newProjects = response.projects.map((project: any) => ({
                    id: project.id,
                    projectName: project.projectName,
                    progress: project.progress,
                    priority: project.priority,
                    startDate: null,
                    dueDate: null,
                }));
                setRows([...rows, ...newProjects]);
                console.log("new projects", ...newProjects);
                console.log("here are my existing projects", response.projects);
                console.log("here are my existing rows", rows);
            })
            .catch(error => console.error('Error adding row:', error));
    };
    const updateRowInDB = (row: RowData) => {
        updateProject(row)
            // axios.put(`http://localhost:9090/updateProject`, row)
            .then(response => console.log('Row updated:', response.data))
            .catch(error => console.error('Error updating row:', error));
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TableContainer component={Box} sx={{ maxHeight: '400px', overflowX: 'auto' }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ cursor: 'pointer', padding: '8px' }}>Project Name</TableCell>
                            <TableCell style={{ padding: '8px' }}>Start Date</TableCell>
                            <TableCell style={{ padding: '8px' }}>Due Date</TableCell>
                            {/* <TableCell style={{ padding: '8px' }}>Assignees</TableCell> */}
                            <TableCell style={{ padding: '8px' }}>Status</TableCell>
                            <TableCell style={{ padding: '8px' }}>Percent Completed</TableCell>
                            <TableCell style={{ padding: '8px' }}>Priority</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, rowIndex) => (
                            <TableRow key={row.id} style={{ height: '40px' }}>
                                <TableCell style={{ padding: '8px', display: 'flex', alignItems: 'center' }}>
                                    <TextField
                                        value={row.projectName}
                                        onChange={(event) => {
                                            const updatedRows = [...rows];
                                            updatedRows[rowIndex].projectName = event.target.value;
                                            setRows(updatedRows);
                                            updateRowInDB(updatedRows[rowIndex]);
                                        }}
                                        fullWidth
                                        variant="outlined"
                                        placeholder="Enter project name"
                                        sx={{ marginRight: '8px' }}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleProjectNameClick(row.id)}
                                    >
                                        Open
                                    </Button>
                                </TableCell>
                                <TableCell style={{ padding: '8px' }}>
                                    <DatePicker
                                        value={row.startDate}
                                        onChange={(date) => {
                                            const updatedRows = [...rows];
                                            updatedRows[rowIndex].startDate = date;
                                            setRows(updatedRows);
                                            updateRowInDB(updatedRows[rowIndex]);
                                        }}
                                        format="DD/MM/YYYY"
                                        // renderInput={(params) => <TextField {...params} fullWidth />}
                                        // placeholder="Pick start date"
                                        sx={{ width: '100%' }}
                                    />
                                </TableCell>
                                <TableCell style={{ padding: '8px' }}>
                                    <DatePicker
                                        value={row.dueDate}
                                        onChange={(date) => {
                                            const updatedRows = [...rows];
                                            updatedRows[rowIndex].dueDate = date;
                                            setRows(updatedRows);
                                            updateRowInDB(updatedRows[rowIndex]);
                                        }}
                                        format="DD/MM/YYYY"
                                        // renderInput={(params) => <TextField {...params} fullWidth />}
                                        // placeholder="Pick due date"
                                        sx={{ width: '100%' }}
                                    />
                                </TableCell>
                                <TableCell style={{ padding: '8px' }}>
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
                                    >
                                        <MenuItem value="not_started" style={{ color: '#F44336' }}>Not Started</MenuItem>
                                        <MenuItem value="in_progress" style={{ color: '#FFC107' }}>In Progress</MenuItem>
                                        <MenuItem value="completed" style={{ color: '#4CAF50' }}>Completed</MenuItem>
                                    </Select>
                                </TableCell>
                                <TableCell style={{ padding: '8px' }}></TableCell>
                                <TableCell style={{ padding: '8px' }}>
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

            <Box mt={2} textAlign="center">
                <Button variant="contained" onClick={handleAddRow}>Add More</Button>
            </Box>

            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={handleCloseDrawer}
            >
                <Box sx={{ width: 920 }}>
                    <Typography variant="h6" gutterBottom>
                        {/* Project Details (ID: {selectedProjectId}) */}
                    </Typography>
                    {selectedProjectId && <Test projectId={selectedProjectId} />}
                </Box>
            </Drawer>
        </LocalizationProvider>
    );
};

export default HorizontalSection;
