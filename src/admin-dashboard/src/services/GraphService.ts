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

// Get peak usage times for sign-ins (by hour)
export async function getPeakUsageTimes(): Promise<any> {
  ensureClient(authProvider);

  const now = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(now.getDate() - 7);

  const signIns = await graphClient!.api('/auditLogs/signIns')
    .filter(`createdDateTime ge ${lastWeek.toISOString()} and createdDateTime le ${now.toISOString()}`)
    .header('ConsistencyLevel', 'eventual')
    .get();

  // Track sign-ins by hour
  const hourData = signIns.value.reduce((acc: any, log: any) => {
    const hour = new Date(log.createdDateTime).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(hourData).sort().map((hour) => `${hour}:00`);
  const data = labels.map((hour) => hourData[hour]);

  return { labels, data };
}

// Get user distribution by region
export async function getUserDistribution(): Promise<any> {
  ensureClient(authProvider);

  const users = await graphClient!.api('/users')
    .select('id,city') // Assuming 'city' field exists for region info
    .header('ConsistencyLevel', 'eventual')
    .get();

  const regionData = users.value.reduce((acc: any, user: any) => {
    const region = user.city || 'Unknown'; // Use city or default to Unknown if not available
    acc[region] = (acc[region] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(regionData);
  const data = labels.map((label) => regionData[label]);

  return { labels, data };
}
