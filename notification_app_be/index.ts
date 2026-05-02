import axios from 'axios';
import { Log } from '../logging middleware/logger';

// Type definitions
interface Notification {
    ID: string;
    Type: 'Placement' | 'Result' | 'Event';
    Message: string;
    Timestamp: string;
}

interface ApiResponse {
    notifications: Notification[];
}

const API_URL = 'http://20.207.122.201/evaluation-service/notifications';

// Weight mapping for priority
const PRIORITY_WEIGHTS: Record<Notification['Type'], number> = {
    Placement: 3,
    Result: 2,
    Event: 1,
};

/**
 * Fetches notifications from the provided API.
 */
async function fetchNotifications(): Promise<Notification[]> {
    Log('backend', 'info', 'service', `Starting fetch from ${API_URL}`);
    try {
        const response = await axios.get<ApiResponse>(`${API_URL}?limit=10`, {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJiaGFhdnlhX3N1cmFAc3JtYXAuZWR1LmluIiwiZXhwIjoxNzc3NzA0MjAyLCJpYXQiOjE3Nzc3MDMzMDIsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI0NDk3MmQyZi1jNjcyLTRlNjUtOTExOS1mNGRlN2RhY2E2YTUiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJiaGFhdnlhIiwic3ViIjoiN2ZlYmQyOWYtZGQ1Ny00ZDI1LWI3NjgtODMzMzg4MjlkZjdiIn0sImVtYWlsIjoiYmhhYXZ5YV9zdXJhQHNybWFwLmVkdS5pbiIsIm5hbWUiOiJiaGFhdnlhIiwicm9sbE5vIjoiYXAyMzExMDAxMTIyMiIsImFjY2Vzc0NvZGUiOiJRa2JweEgiLCJjbGllbnRJRCI6IjdmZWJkMjlmLWRkNTctNGQyNS1iNzY4LTgzMzM4ODI5ZGY3YiIsImNsaWVudFNlY3JldCI6InlGQ0h2VlBRd2tDa3Z1QmYifQ.nVnobO2n3Ijsu_RK7DEFVudS6mY8oHL0UNbbvuFklY8'
            }
        });
        const notifications = response.data.notifications;
        Log('backend', 'info', 'service', `Successfully fetched ${notifications?.length || 0} notifications.`);
        return notifications || [];
    } catch (error: any) {
        Log('backend', 'error', 'service', `Failed to fetch notifications from API (${error.message}).`);
        return [];
    }
}

/**
 * Calculates a composite priority score or returns a comparison integer for sorting.
 * We want highest weight first, then most recent timestamp first.
 */
function compareNotifications(a: Notification, b: Notification): number {
    const weightA = PRIORITY_WEIGHTS[a.Type] || 0;
    const weightB = PRIORITY_WEIGHTS[b.Type] || 0;

    if (weightA !== weightB) {
        // Higher weight comes first
        return weightB - weightA;
    }

    // Tie-breaker: Timestamp
    // Formats look like "2026-04-22 17:51:30"
    const timeA = new Date(a.Timestamp).getTime();
    const timeB = new Date(b.Timestamp).getTime();

    // More recent comes first
    return timeB - timeA;
}

/**
 * Retrieves the top N notifications based on priority.
 */
function getTopNotifications(notifications: Notification[], n: number): Notification[] {
    Log('backend', 'debug', 'service', `Sorting ${notifications.length} notifications to find top ${n}`);
    
    // Sort based on priority weight, then recency
    const sorted = [...notifications].sort(compareNotifications);
    
    const topN = sorted.slice(0, n);
    Log('backend', 'info', 'service', `Successfully retrieved top ${n} notifications.`);
    return topN;
}

/**
 * Main application entry point
 */
async function main() {
    Log('backend', 'info', 'service', 'Starting Priority Inbox Backend...');
    
    const allNotifications = await fetchNotifications();
    
    if (allNotifications.length === 0) {
        Log('backend', 'warn', 'service', 'No notifications to process.');
        return;
    }

    const n = 10;
    const top10 = getTopNotifications(allNotifications, n);

    Log('backend', 'info', 'service', `--- TOP ${n} NOTIFICATIONS ---`);
    top10.forEach((notif, index) => {
        Log('backend', 'info', 'service', `#${index + 1} | [${notif.Type}] ${notif.Message} | ${notif.Timestamp}`);
    });
    Log('backend', 'info', 'service', 'Priority Inbox processing complete.');
}

// Execute the main function
main().catch((error) => {
    Log('backend', 'error', 'service', `Unhandled application error: ${error.message}`);
});
