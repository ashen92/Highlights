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

// Get peak usage times for sign-ins (hourly)
export async function getPeakUsageTimes(): Promise<any> {
  ensureClient(authProvider);

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

    // Add userId to the Set for the respective hour (Set ensures uniqueness)
    userActivityByHour[hour].add(userId);
  });

  // Map over the hours and count the unique users per hour
  const hourData = userActivityByHour.map((users) => users.size);

  // Create labels for the hours (0:00 - 1:00, 1:00 - 2:00, etc.)
  const labels = hourData.map((_, i) => `${i}:00 - ${i + 1}:00`);

  return { labels, data: hourData };
}

// Get user distribution by country (by country field)
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

export async function getLoginAttempts(): Promise<any> {
  ensureClient(authProvider);

  // Fetch the sign-ins from Microsoft Graph API
  const signIns = await graphClient!.api('/auditLogs/signIns')
    .select('status, userDisplayName, location')  // Select only needed fields
    .header('ConsistencyLevel', 'eventual')
    .get();

  console.log('Sign-In Data:', signIns.value); // Debug the response

  // Filter successful logins (status.code '0') and failed logins (status.code != '0')
  const successfulLogins = signIns.value.filter((log: any) => log.status?.code === '0');
  const failedLogins = signIns.value.filter((log: any) => log.status?.code !== '0');

  console.log('Successful Logins:', successfulLogins.length);
  console.log('Failed Logins:', failedLogins.length);

  // Return the data in the format needed for the chart
  return {
    labels: ['Successful Logins', 'Failed Logins'],
    datasets: [
      {
        label: 'Login Attempts',
        data: [successfulLogins.length, failedLogins.length],
        backgroundColor: ['rgba(75, 192, 192, 0.7)', 'rgba(255, 99, 132, 0.7)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };
}


export async function getLoginAttemptsByLocation(): Promise<any> {
    ensureClient(authProvider);
  
    const signIns = await graphClient!.api('/auditLogs/signIns')
      .select('location,userId')
      .header('ConsistencyLevel', 'eventual')
      .get();
  
    // Example of grouping by country/location
    const locationData = signIns.value.reduce((acc: any, log: any) => {
      const location = log.location?.city || 'Unknown'; // Fallback to 'Unknown' if location is missing
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {});
  
    const labels = Object.keys(locationData);
    const data = labels.map((label) => locationData[label]);
  
    return {
      labels,
      datasets: [
        {
          label: 'Login Attempts by Location',
          data: data,
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
}

export async function getBlockedAccounts(): Promise<number> {
  ensureClient(authProvider);

  const users = await graphClient!.api('/users')
    .filter("accountEnabled eq false")
    .count(true)
    .get();

  return users['@odata.count'] || 0;
}

export async function getActiveUsersNow(): Promise<any> {
  ensureClient(authProvider);

  const now = new Date();
  const startTime = new Date(now.getTime() - 5 * 60 * 1000); // Time frame: last 5 minutes
  const endTime = now;

  const signIns = await graphClient!.api('/auditLogs/signIns')
    .filter(`createdDateTime ge ${startTime.toISOString()} and createdDateTime le ${endTime.toISOString()}`)
    .header('ConsistencyLevel', 'eventual')
    .get();

  // Extract the unique users and their locations
  const activeUsers = signIns.value.map((log: any) => {
    return {
      userId: log.userId,
      userDisplayName: log.userDisplayName,
      location: log.location ? log.location.city : 'Unknown', // Adjust as needed for location details
      country: log.location ? log.location.countryOrRegion : 'Unknown',
    };
  });

  return activeUsers;
}

export async function getNewUserRegistrations(): Promise<any> {
  ensureClient(authProvider);

  const users = await graphClient!.api('/users')
    .filter("createdDateTime ge 2023-01-01T00:00:00Z") // Example filter: users created since January 1, 2023
    .select('city,country,createdDateTime')
    .get();

  const locationData = users.value.reduce((acc: any, user: any) => {
    const location = user.city || user.country || 'Unknown';
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(locationData);
  const data = labels.map((label) => locationData[label]);

  return { labels, data };
}

export async function getNewUsersByLocation(): Promise<any> {
  ensureClient(authProvider);

  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  const twoWeeksAgoISO = twoWeeksAgo.toISOString();

  const users = await graphClient!
    .api('/users')
    .select('city,country,createdDateTime')
    .filter(`createdDateTime ge ${twoWeeksAgoISO}`)
    .get();

  // Group users by location
  const locationData = users.value.reduce((acc: any, user: any) => {
    const location = user.city || user.country || 'Unknown';
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(locationData);
  const data = labels.map((label) => locationData[label]);

  return {
    labels,
    datasets: [
      {
        label: 'New Users by Location (Last 2 Weeks)',
        data: data,
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(231, 74, 59, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
      },
    ],
  };
}



  

