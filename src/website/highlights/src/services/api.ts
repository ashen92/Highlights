import { apiEndpoint } from "@/apiConfig";
import { aquireAccessToken } from "@/util/auth";
import { Task, Review } from "@/models/Task";
// import { HighlightTask , Task1} from "@/models/HighlightTask";
import { h_GetHighlights, HighlightTask , Task1} from "@/models/HighlightTask";
import { mTimer, mPauses_details, mTimeRecord, mPauseContinueDetails, StartDetails, EndDetails, ActiveHighlightDetails, ActiveStopwatchDetails, EndStopwatchDetails, mStopwatch_Pauses_details, mStopwatchPauseContinueDetails, mStopwatchTimeRecord } from "@/models/Timer";
import { Tip } from "@/models/Tip";
import { Feedback } from "@/models/Feedback";
import axios, { AxiosInstance } from "axios";
import { Highlight } from "@/models/Highlight";
import { IssueFormErrors, IssueForm } from "@/models/IssueForm";
import { CalendarEvent } from "@/models/HighlightTypes";
import { User } from "@/features/auth";
import { TaskListSource } from "@/features/tasks";
import { Preference } from "@/models/Preference";

function getAxiosClient(route: string): AxiosInstance {
    const client = axios.create({
        baseURL: `${apiEndpoint}/${route}`
    });

    client.interceptors.request.use(async (config) => {
        config.headers['Authorization'] = `Bearer ${await aquireAccessToken()}`;
        return config;

    }, (error) => {
        return Promise.reject(error);
    });
    return client;
}

export async function getTasks(user: User): Promise<Task[]> {
    const response = await getAxiosClient('highlights/tasks').request<Task[]>({
        method: 'GET',
        params: { userId: user.id }
    });
    return response.data;
}

export async function getTaskLists(user: User) {
    const response = await getAxiosClient('taskLists').request({
        method: 'GET',
        params: {
            sub: user.sub
        }
    });
    let taskLists = [];
    for (let taskList of response.data) {
        taskLists.push({
            id: taskList.id,
            title: taskList.title,
            source: TaskListSource.Highlights
        });
    }
    return taskLists;
}

export async function createTask(task: Task, user: User): Promise<Task> {
    const response = await getAxiosClient('highlights/tasks').request<Task>({
        method: 'POST',
        data: {
            ...task,
            userId: user.id
        }
    });

    return response.data;
}

export async function getHighlights(user: User): Promise<h_GetHighlights[]> {
    const response = await getAxiosClient('focus/highlights').request<h_GetHighlights[]>({
        method: 'GET',
        params: { userId: user.id }
    });

    return response.data;
}

export async function getTimerDetails(): Promise<mTimer[]> {
    const response = await getAxiosClient('focus/timer_details').request<mTimer[]>({
        method: 'GET'
    });

    return response.data;
}

export async function sendTimerEndData(pomo_details: {
    pomo_id: number;
    timer_id: number;
    highlight_id: number;
    user_id: number;
    // start_time: string; 
    end_time: string;
    status: string;
}): Promise<EndDetails> {
    try {

        console.log('Sending timer end data:', JSON.stringify(pomo_details, null, 2));

        const axiosInstance = getAxiosClient('focus/end_pomo_details');

        const response = await axiosInstance.post('', pomo_details);

        return response.data;
    } catch (error) {

        if (axios.isAxiosError(error)) {

            console.error('Error sending timer end data:', error.response?.data || error.message);
        } else {

            console.error('Unexpected error:', error);
        }

        throw error;
    }
}


// Function to update task status by sending highlightId
export async function updateTaskStatus(highlightId: number): Promise<void> {
    console.log("id-------------",highlightId);
    // await getAxiosClient('focus/updateTaskStatus').request({
    //     method: 'PUT',
    //     data: {
    //         highlightId 
    //     }
    // });
    await getAxiosClient(`focus/updateTaskStatus/${highlightId}`).request({
        method: 'PUT',
    });
    
}



export async function sendStartTimeData(startDetails: {
    timer_id: number;
    highlight_id: number;  // Changed from string to number
    user_id: number;
    start_time: string;  // Assuming ISO 8601 string format for time
    // end_time: string;    // Assuming ISO 8601 string format for time
    status: string
}): Promise<StartDetails> {
    try {
        // Print the details of the data being sent
        console.log('Sending start time data:', JSON.stringify(startDetails, null, 2));

        // Create the Axios instance with the appropriate base URL
        const axiosInstance = getAxiosClient('focus/start_pomo_details');

        // Make the POST request to the backend API
        const response = await axiosInstance.post('', startDetails);

        // Return the response data (if any)
        return response.data;
    } catch (error) {
        // Handle errors
        if (axios.isAxiosError(error)) {
            // Handle known Axios errors
            console.error('Error sending start time data:', error.response?.data || error.message);
        } else {
            // Handle other errors
            console.error('Unexpected error:', error);
        }

        // Optionally, you can throw the error again or handle it differently
        throw error;
    }
}

export async function sendPauseData(pauseDetails: {
    pomo_id: number;
    highlight_id: number;
    pause_time: string;

}): Promise<mPauses_details> {
    try {

        console.log('Sending pause data:', JSON.stringify(pauseDetails, null, 2));

        const axiosInstance = getAxiosClient('focus/pause_pomo_details');

        const response = await axiosInstance.post('', pauseDetails);

        return response.data;
    } catch (error) {

        if (axios.isAxiosError(error)) {

            console.error('Error sending pause data:', error.response?.data || error.message);
        } else {

            console.error('Unexpected error:', error);
        }

        throw error;
    }
}

export async function sendContinueData(continueDetails: {
    pomo_id: number;
    highlight_id: number;
    continue_time: string;

}): Promise<mPauses_details> {
    try {
        console.log('Sending pause data:', JSON.stringify(continueDetails, null, 2));

        const axiosInstance = getAxiosClient('focus/continue_pomo_details');

        const response = await axiosInstance.post('', continueDetails);

        return response.data;
    } catch (error) {

        if (axios.isAxiosError(error)) {

            console.error('Error sending pause data:', error.response?.data || error.message);
        } else {

            console.error('Unexpected error:', error);
        }

        throw error;
    }
}

export async function getFocusRecord(userId: number, activeTab: string): Promise<mTimeRecord[]> {
    try {
        const response = await getAxiosClient('focus/focus_record').request<mTimeRecord[]>({
            method: 'GET',
            url: `/${userId}`
        });

        console.log('Data sent to the backend:----------------------------------------------------------', response.data);

        return response.data;
    } catch (error) {
        console.error('Error fetching focus record:', error);
        throw error;
    }
}

export async function getActiveTimerHighlightDetails(userId: number): Promise<ActiveHighlightDetails[]> {
    try {
        const response = await getAxiosClient('focus/active_timer_highlight_details').request<ActiveHighlightDetails[]>({
            method: 'GET',
            url: `/${userId}`
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching active timer highlight details:', error);
        throw error;
    }
}

export async function getActiveStopwatchHighlightDetails(userId: number): Promise<ActiveStopwatchDetails[]> {
    try {
        const response = await getAxiosClient('focus/active_stopwatch_highlight_details').request<ActiveStopwatchDetails[]>({
            method: 'GET',
            url: `/${userId}`
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching active timer highlight details:', error);
        throw error;
    }
}

export async function getPauseDetails(userId: number, activeTab: string): Promise<mPauseContinueDetails[]> {
    try {

        const response = await getAxiosClient('focus/pause_details').request<mPauseContinueDetails[]>({
            method: 'GET',
            url: `/${userId}`
        });

        return response.data;

    } catch (error) {
        console.error('Error fetching pause details:', error);
        throw error;
    }
}

export async function sendStartStopwatchData(startDetails: {
    timer_id: number;
    highlight_id: number;
    user_id: number;
    start_time: string;
    // end_time: string;   
    status: string
}): Promise<StartDetails> {
    try {

        console.log('Sending start time data:', JSON.stringify(startDetails, null, 2));

        const axiosInstance = getAxiosClient('focus/start_stopwatch_details');

        const response = await axiosInstance.post('', startDetails);

        return response.data;
    } catch (error) {

        if (axios.isAxiosError(error)) {

            console.error('Error sending start time data:', error.response?.data || error.message);
        } else {

            console.error('Unexpected error:', error);
        }

        throw error;
    }
}


export const changestatus = async (taskId: string): Promise<void> => {
    await getAxiosClient('highlights/completed').request({
        method: 'PUT',
        url: `/${taskId}`,
    });
}
export async function getTasktime(user: User, dueDate: Date | null): Promise<Task[]> {
    console.log("User:", user);
    console.log("Due Date:", dueDate);

    // Ensure the dueDate is formatted appropriately (e.g., "YYYY-MM-DD")
    const formattedDueDate = dueDate ? dueDate.toISOString().split('T')[0] : null;

    const response = await getAxiosClient('highlights/time').request<Task[]>({
        method: 'GET',
        params: {
            userId: user.id,
            dueDate: formattedDueDate, // Include dueDate in the request parameters
        },
    });

    return response.data;
}


export async function sendEndStopwatchData(stopwatch_details: {
    stopwatch_id: number;
    timer_id: number,
    highlight_id: number;  // Changed from string to number
    user_id: number;
    // start_time: string;  // Assuming ISO 8601 string format for time
    end_time: string;    // Assuming ISO 8601 string format for time
    status: string;
}): Promise<EndStopwatchDetails> {
    try {

        // Print the details of the data being sent
        console.log('Sending timer end data:', JSON.stringify(stopwatch_details, null, 2));

        // Create the Axios instance with the appropriate base URL
        const axiosInstance = getAxiosClient('focus/end_stopwatch_details');


        // Make the POST request to the backend API
        const response = await axiosInstance.post('', stopwatch_details);

        // Return the response data
        return response.data;
    } catch (error) {
        // Handle errors
        if (axios.isAxiosError(error)) {
            // Handle known Axios errors
            console.error('Error sending timer end data:', error.response?.data || error.message);
        } else {
            // Handle other errors
            console.error('Unexpected error:', error);
        }

        // Optionally, you can throw the error again or handle it differently
        throw error;
    }
}



export const updateReview = async (review: Review): Promise<Review> => {
    const response = await getAxiosClient('review').request<Review>({
        method: 'POST',
        url: `/${review.id}`,
        data: review
    });

    return response.data;
}



export async function sendPauseStopwatchData(pauseDetails: {
    stopwatch_id: number;
    highlight_id: number;
    pause_time: string;

}): Promise<mStopwatch_Pauses_details> {
    try {

        console.log('Sending pause data:', JSON.stringify(pauseDetails, null, 2));

        const axiosInstance = getAxiosClient('focus/pause_stopwatch_details');

        const response = await axiosInstance.post('', pauseDetails);

        return response.data;
    } catch (error) {

        if (axios.isAxiosError(error)) {
            console.error('Error sending pause data:', error.response?.data || error.message);
        } else {
            console.error('Unexpected error:', error);
        }

        throw error;
    }
}

export async function sendContinueStopwatchData(continueDetails: {
    stopwatch_id: number;
    highlight_id: number;
    continue_time: string;

}): Promise<mStopwatch_Pauses_details> {
    try {

        console.log('Sending pause data:', JSON.stringify(continueDetails, null, 2));

        const axiosInstance = getAxiosClient('focus/continue_stopwatch_details');

        const response = await axiosInstance.post('', continueDetails);

        return response.data;
    } catch (error) {

        if (axios.isAxiosError(error)) {

            console.error('Error sending pause data:', error.response?.data || error.message);
        } else {

            console.error('Unexpected error:', error);
        }

        throw error;
    }
}

export async function getStopwatchPauseDetails(userId: number, activeTab: string): Promise<mStopwatchPauseContinueDetails[]> {
    try {

        const response = await getAxiosClient('focus/stopwatch_pause_details').request<mStopwatchPauseContinueDetails[]>({
            method: 'GET',
            url: `/${userId}`
        });

        return response.data;

    } catch (error) {
        console.error('Error fetching pause details:', error);
        throw error;
    }
}

export async function getStopwatchFocusRecord(userId: number, activeTab: string): Promise<mStopwatchTimeRecord[]> {
    try {
        const response = await getAxiosClient('focus/stopwatch_focus_record').request<mStopwatchTimeRecord[]>({
            method: 'GET',
            url: `/${userId}`
        });

        console.log('Data sent to the backend:----------------------------------------------------------', response.data);

        return response.data;
    } catch (error) {
        console.error('Error fetching focus record:', error);
        throw error;
    }
}

export async function updateTask(task: Task): Promise<Task> {
    console.log("Updating task:", task);
    try {
        const client = getAxiosClient('highlights/tasks');
        const response = await client.request<Task>({
            method: 'PUT',
            url: `/${task.id}`, // Ensure the URL includes the task ID
            data: task
        });
        console.log("Task updated:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error updating task:", error);
        throw error;
    }
}

export async function deleteTask(taskId: number): Promise<void> {
    try {
        const client = getAxiosClient('highlights/tasks');
        await client.request<void>({
            method: 'DELETE',
            url: `/${taskId}` // Ensure the URL includes the task ID
        });
    } catch (error) {
        console.error("Error deleting task:", error);
        throw error;
    }
}

// export async function getHighlights() {
//     const response = await getAxiosClient('highlights').request<Highlight[]>({
//         method: 'GET'
//     });

//     return response;
// }

export async function addTip(tip: Tip): Promise<Tip> {
    const response = await getAxiosClient('tips').request<Tip>({
        method: 'POST',
        data: tip
    });
    return response.data;
}
export async function getProjects(email: string) {
    const response = await getAxiosClient(`projects/projects/${email}`).request({
        method: 'GET'
    });

    return response;
}
export async function addProjects(tip: any) {
    const response = await getAxiosClient('projects/addProjects')({
        method: 'POST',
        data: tip
    });
    return response.data;
}
export async function updateProject(row: any) {
    const response = await getAxiosClient('projects/updateProject')({
        method: 'PUT',
        data: row
    });
    return response.data;
}
export async function getProjectDetails() {
    const response = await getAxiosClient('projects/project-details').request({
        method: 'GET'
    });

    return response;
}
export async function addTask(row: any) {
    const response = await getAxiosClient('projects/addTask')({
        method: 'POST',
        data: row
    });
    return response.data;
}
export async function updateMyTask(row: any) {
    const response = await getAxiosClient('projects/updateTask')({
        method: 'PUT',
        data: row
    });
    return response.data;
}
export async function tasks(projectId: any) {
    const response = await getAxiosClient(`projects/tasks/${projectId}`).request({
        method: 'GET'
        // params: {
        //     projectId: projectId
        // }
    });
    return response.data;
}
export async function project(projectId: any) {
    const response = await getAxiosClient(`projects/project/${projectId}`).request({
        method: 'GET'
        // params: {
        //     projectId: projectId
        // }
    });
    return response.data;
}
export async function getAssignedTasks(email: string) {
    const response = await getAxiosClient(`projects/assignedTasks/${email}`).request({
        method: 'GET'
        // params: {
        //     projectId: projectId
        // }
    });
    console.log("assigned tasks",response);
    return response.data;
}

export const getEstimatedTime = async (task: any) => {
    try {
        const client = getAxiosClient('');
        const response = await client.post(`/highlights/predict/`, task);
        return response.data.estimated_time;
    } catch (error) {
        console.error("Error getting estimated time:", error);
        return null;
    }
};

export async function submitIssue(issue: IssueForm, user: User): Promise<void> {
    try {
      // Merge userId into issue payload before sending
      const issueData = {
        ...issue,
        userId: user.id,
      };
  
      await getAxiosClient('issues/issues').request({
        method: 'POST',
        data: issueData,
      });
  
      console.log('Issue submitted successfully');
    } catch (error) {
      console.error('Error submitting issue:', error);
      throw error; // Allow the caller to handle the error
    }
  }


//   };


// export async function getCalendarEvents(): Promise<localCalendarEvent[]> {
//     try {
//         const response = await getAxiosClient('calendar/events').request<localCalendarEvent[]>({
//             method: 'GET'
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching calendar events:', error);
//         throw error;
//     }
// }

//   export async function createCalendarEvent(payload: CreateEventPayload): Promise<CalendarEvent> {
//     const response = await getAxiosClient('calendar/events').request<CalendarEvent>({
//       method: 'POST',
//       data: payload
//     });
//     return response.data;
//   }

//   export async function updateCalendarEvent(eventId: number, payload: UpdateEventPayload): Promise<CalendarEvent> {
//     const response = await getAxiosClient(`calendar/events/${eventId}`).request<CalendarEvent>({
//       method: 'PUT',
//       data: payload
//     });
//     return response.data;
//   }

//   export async function deleteCalendarEvent(eventId: number): Promise<void> {
//     await getAxiosClient(`calendar/events/${eventId}`).request({
//       method: 'DELETE'
//     });
//   }


// Fetch a random daily tip
export async function getRandomTip(user_id: number): Promise<Tip> {
    try {
        const response = await getAxiosClient('tips/randomTip').request<Tip>({
            method: 'GET',
            params:  { user_id },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching random tip:', error);
        throw error;
    }
}

// Function to send feedback
export async function sendFeedback(feedback: Feedback): Promise<void> {
    try {
        await getAxiosClient('tips/feedback').request({
            method: 'POST',
            data: feedback,
        });
    } catch (error) {
        console.error('Error sending feedback: ', error);
        throw error;
    }
}

export async function savePreferences(Preferences: Preference): Promise<void> {
    try {
        await getAxiosClient('tips/saveUserPreferences').request({
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: Preferences,
        });
    } catch(error) {
        console.error('Error sending preferences: ', error);
        throw error;
    }
}








export async function fetchHighlights(userId: string): Promise<CalendarEvent[]> {
    const response = await getAxiosClient('calendar/highlights').request<CalendarEvent[]>({
        method: 'GET',
        url: `/${userId}`
    });

    // Map backend response to match frontend requirements
    return response.data.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description || '',
        start_time: task.start_time || '', // Use backend's `start_time` field
        end_time: task.end_time || null, // Use backend's `end_time` field
        dueDate: task.dueDate || null,
        reminder: task.reminder || null,
        priority: task.priority,
        label: task.label,
        status: task.status,
        userId: task.userId,
    }));
}

export async function fetchHighlightsCompletion(user: User): Promise<Task[]> {
    console.log("ssssssss")
    const response = await getAxiosClient('analatics/fetchHighlightsCompletion').request<Task[]>({
        method: 'GET',
        params: { userId: user.id }
    });
    return response.data;
}

export async function antasks(user: User): Promise<Task[]> {
    console.log("ssssssss")
    const response = await getAxiosClient('analatics/antasks').request<Task[]>({
        method: 'GET',
        params: { userId: user.id }
    });
    return response.data;
}


export async function focustime1(user: User): Promise<Task[]> {
    console.log("Fetching focus time...");

    try {
        const response = await getAxiosClient('analatics/getFullFocusTime').request<Task[]>({
            method: 'GET',
            params: { userId: user.id } // Pass userId as query parameter
        });
        
        return response.data;
    } catch (error) {
        console.error("Error fetching focus time:", error);
        throw error;
    }
}


export async function getproject(user: User): Promise<Task1[]> {
    console.log("Fetching focus time...");

    try {
        // Pass email instead of userId
        const response = await getAxiosClient('analatics/getproject').request<Task1[]>({
            method: 'GET',
            params: { userId: user.id }
        });

        return response.data; 
    } catch (error) {
        console.error("Error fetching focus time:", error);
        throw error;
    }
}

export async function getTasktime1(user: User): Promise<Task[]> {
    console.log(user)
    const response = await getAxiosClient('highlights/time1').request<Task[]>({
        method: 'GET',
        params: {
            userId: user.id
        }
    });
    return response.data;
}


