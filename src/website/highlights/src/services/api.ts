import { apiEndpoint } from "@/apiConfig";
import { aquireAccessToken } from "@/util/auth";
import { Task ,Review} from "@/models/Task";
import { HighlightTask } from "@/models/HighlightTask";
import { mTimer, mPomo_details, mPauses_details, mTimeRecord, mPauseContinueDetails,StartDetails,EndDetails ,ActiveHighlightDetails, ActiveStopwatchDetails, EndStopwatchDetails, mStopwatch_Pauses_details, mStopwatchPauseContinueDetails, mStopwatchTimeRecord} from "@/models/Timer";
import { Tip } from "@/models/Tip";
import axios, { AxiosInstance } from "axios";
import { Highlight } from "@/models/Highlight";
import { AppUser } from "@/hooks/useAppUser";

// Function to create an Axios client with authorization
function getAxiosClient(route: string): AxiosInstance {
    console.log("d")
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

export async function getTasks(): Promise<Task[]> {
    const response = await getAxiosClient('tasks').request<Task[]>({
        method: 'GET'
    });
    return response.data;
}

export async function getTaskLists(user: AppUser) {
    const response = await getAxiosClient('taskLists').request({
        method: 'GET',
        params: {
            sub: user.sub
        }
    });
    return response.data;
}

export async function createTask(task: Task): Promise<Task> {
    console.log(task)
    const response = await getAxiosClient('tasks').request<Task>({
        method: 'POST',
        data: task
    });

    return response.data;
}

export async function getHighlights(): Promise<HighlightTask[]> {
    const response = await getAxiosClient('highlights').request<HighlightTask[]>({
        method: 'GET'
    });

    return response.data;
}

export async function getTimerDetails(): Promise<mTimer[]> {
    const response = await getAxiosClient('timer_details').request<mTimer[]>({
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

        const axiosInstance = getAxiosClient('end_pomo_details');

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
      const axiosInstance = getAxiosClient('start_pomo_details');
  
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

        const axiosInstance = getAxiosClient('pause_pomo_details');

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

        const axiosInstance = getAxiosClient('continue_pomo_details');

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
        const response = await getAxiosClient('focus_record').request<mTimeRecord[]>({
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
        const response = await getAxiosClient('active_timer_highlight_details').request<ActiveHighlightDetails[]>({
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
        const response = await getAxiosClient('active_stopwatch_highlight_details').request<ActiveStopwatchDetails[]>({
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

        const response = await getAxiosClient('pause_details').request<mPauseContinueDetails[]>({
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
  
      const axiosInstance = getAxiosClient('start_stopwatch_details');
  
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
    console.log(taskId); 
console.log("ccc")
    await getAxiosClient('completed').request({
        method: 'PATCH',
        url: `/completed/${taskId}`,
        data: { status: 'completed' } 
    });
}
export async function getTasktime(): Promise<Task[]> {
    const response = await getAxiosClient('time').request<Task[]>({
        method: 'GET'
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
        const axiosInstance = getAxiosClient('end_stopwatch_details');


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
    console.log(review); // Log the review object, not 'task'

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

        const axiosInstance = getAxiosClient('pause_stopwatch_details');

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

        const axiosInstance = getAxiosClient('continue_stopwatch_details');

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

        const response = await getAxiosClient('stopwatch_pause_details').request<mStopwatchPauseContinueDetails[]>({
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
        const response = await getAxiosClient('stopwatch_focus_record').request<mStopwatchTimeRecord[]>({
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
        const client = getAxiosClient('tasks');
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
    console.log("Deleting task with ID:", taskId);
    try {
        const client = getAxiosClient('tasks');
        await client.request<void>({
            method: 'DELETE',
            url: `/${taskId}` // Ensure the URL includes the task ID
        });
        console.log("Task deleted");
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
export async function getProjects() {
    const response = await getAxiosClient('projects').request({
        method: 'GET'
    });

    return response;
}
export async function addProjects(tip: any) {
    console.log("add projects");
    const response = await getAxiosClient('addProjects')({
        method: 'POST',
        data: tip
    });
    console.log("Hello", response.data);
    return response.data;
}
export async function updateProject(row: any) {
    // console.log("cc")
    const response = await getAxiosClient('updateProject')({
        method: 'PUT',
        data: row
    });
    // console.log("Hello");
    return response.data;
}
export async function getProjectDetails() {
    const response = await getAxiosClient('project-details').request({
        method: 'GET'
    });

    return response;
}
export async function addTask(row: any) {
    // console.log("cc")
    const response = await getAxiosClient('addTask')({
        method: 'POST',
        data: row
    });
    // console.log(response);
    // console.log("Hello");
    return response.data;
}
export async function updateMyTask(row: any) {
    // console.log("cc")
    const response = await getAxiosClient('updateTask')({
        method: 'PUT',
        data: row
    });
    // console.log("Hello");
    return response.data;
}
export async function tasks(projectId: any) {
    const response = await getAxiosClient(`tasks/${projectId}`).request({
        method: 'GET'
        // params: {
        //     projectId: projectId
        // }
    });
    console.log("jagaht");
    return response.data;
}
export async function project(projectId: any) {
    const response = await getAxiosClient(`project/${projectId}`).request({
        method: 'GET'
        // params: {
        //     projectId: projectId
        // }
    });
    // console.log(response);
    return response.data;
}

export const getEstimatedTime = async (task: any) => {
    try {
    //   const client = getAxiosClient(''); 
      const response = await axios.post(`${apiEndpoint}/predict/`, task);
      return response.data.estimated_time;
    } catch (error) {
      console.error("Error getting estimated time:", error);
      return null;
    }
  };
  