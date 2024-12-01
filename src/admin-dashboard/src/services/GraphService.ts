import { authProvider } from '@/pages/_app';
import { Client } from '@microsoft/microsoft-graph-client';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import { User } from '@microsoft/microsoft-graph-types';

let graphClient: Client | undefined = undefined;

// Ensure the client is initialized
function ensureClient(authProvider: AuthCodeMSALBrowserAuthenticationProvider) {
  if (!graphClient) {
    graphClient = Client.initWithMiddleware({
      authProvider: authProvider,
    });
  }

  return graphClient;
}

// Get current authenticated user
export async function getUser(): Promise<User> {
  ensureClient(authProvider);
  const user: User = await graphClient!.api('/me').get();
  return user;
}

// Get all users
export async function getAllUsers(): Promise<any> {
  ensureClient(authProvider);
  const users = await graphClient!.api('/users').get();
  return users;
}

// Get user count
export async function getUserCount(): Promise<any> {
  ensureClient(authProvider);
  const count = await graphClient!
    .api('/users/$count')
    .header('ConsistencyLevel', 'eventual')
    .get();
  return count;
}

// Get new users in the past 14 days
export async function getNewUsers(lastDays: number = 14): Promise<User[]> {
  ensureClient(authProvider);
  
  const currentDate = new Date();
  const pastDate = new Date();
  pastDate.setDate(currentDate.getDate() - lastDays);

  const startDate = pastDate.toISOString();
  const endDate = currentDate.toISOString();

  const users = await graphClient!
    .api('/users')
    .header('ConsistencyLevel', 'eventual')
    .filter(`createdDateTime ge ${startDate} and createdDateTime le ${endDate}`)
    .get();

  return users.value; // Return the array of new users
}

// Get user growth by month
export async function getUserGrowth(): Promise<any> {
  ensureClient(authProvider);

  const users = await graphClient!.api('/users')
    .select('id,createdDateTime') // Fetch only necessary fields
    .header('ConsistencyLevel', 'eventual')
    .get();

  // Group users by month
  const monthlyData = users.value.reduce((acc: any, user: any) => {
    const createdDate = new Date(user.createdDateTime);
    const month = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, '0')}`;
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  // Format the result for charts
  const labels = Object.keys(monthlyData).sort();
  let cumulativeData: number[] = [];
  let cumulativeCount = 0;

  // Calculate cumulative user growth
  labels.forEach((label) => {
    cumulativeCount += monthlyData[label];
    cumulativeData.push(cumulativeCount);
  });

  return { labels, data: cumulativeData };
}

// Get active users by day for sign-ins
export async function getActiveUsersByDay(): Promise<any> {
  ensureClient(authProvider);

  const now = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(now.getDate() - 7);

  const signIns = await graphClient!.api('/auditLogs/signIns')
    .filter(`createdDateTime ge ${lastWeek.toISOString()} and createdDateTime le ${now.toISOString()}`)
    .header('ConsistencyLevel', 'eventual')
    .get();

  // Count unique users per day
  const dailyData = signIns.value.reduce((acc: any, log: any) => {
    const date = new Date(log.createdDateTime).toISOString().split('T')[0];

    if (!acc[date]) acc[date] = { users: new Set(), locations: new Set() };

    acc[date].users.add(log.userId);
    if (log.location && log.location.city) {
      acc[date].locations.add(log.location.city);
    }
    
    return acc;
  }, {});

  const labels = Object.keys(dailyData).sort();
  const data = labels.map((date) => dailyData[date].users.size);
  const locations = labels.map((date) => Array.from(dailyData[date].locations).join(', '));

  return { labels, data, locations };
}

export async function getPeakUsageTimes(): Promise<any> {
  const now = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(now.getDate() - 7);

  const signIns = await graphClient!
    .api('/auditLogs/signIns')
    .filter(`createdDateTime ge ${lastWeek.toISOString()} and createdDateTime le ${now.toISOString()}`)
    .header('ConsistencyLevel', 'eventual')
    .get();

  // Initialize an object to track distinct users per hour
  const userActivityByHour = Array(24).fill(new Set());

  // Loop through the sign-in events and record unique user IDs per hour
  signIns.value.forEach((log: any) => {
    const date = new Date(log.createdDateTime);
    const hour = date.getUTCHours();  // Using UTC to avoid time zone issues
    const userId = log.userId;

    // Log the sign-in details for debugging
    console.log(`User ${userId} signed in at ${date.toISOString()} (Hour: ${hour})`);

    // Add userId to the Set for the respective hour (Set ensures uniqueness)
    userActivityByHour[hour].add(userId);
  });

  // Map over the hours and count the unique users per hour
  const hourData = userActivityByHour.map((users) => users.size);

  // Create labels for the hours (0:00 - 1:00, 1:00 - 2:00, etc.)
  const labels = hourData.map((_, i) => `${i}:00 - ${i + 1}:00`);
  
  // Log the final data for debugging
  console.log("Hour Data:", hourData);
  console.log("Labels:", labels);

  // Return the hourly data
  return { labels, data: hourData };
}



// Get user distribution by country
export async function getUserDistribution(): Promise<any> {
  ensureClient(authProvider);

  // Fetch user data, including the 'country' field
  const users = await graphClient!.api('/users')
    .select('id,country') // Include only necessary fields
    .header('ConsistencyLevel', 'eventual')
    .get();

  // Group users by country
  const countryData = users.value.reduce((acc: any, user: any) => {
    const country = user.country || 'Unknown'; // Use 'country' field or default to 'Unknown'
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {});

  // Extract labels (countries) and data (counts)
  const labels = Object.keys(countryData);
  const data = labels.map((label) => countryData[label]);

  return { labels, data };
}

