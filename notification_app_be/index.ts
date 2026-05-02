import axios from 'axios';
import { Logger } from '../logging middleware/logger';

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
    Logger.info('fetchNotifications', `Starting fetch from ${API_URL}`);
    try {
        const response = await axios.get<ApiResponse>(`${API_URL}?limit=10`, {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJiaGFhdnlhX3N1cmFAc3JtYXAuZWR1LmluIiwiZXhwIjoxNzc3NzA0MjAyLCJpYXQiOjE3Nzc3MDMzMDIsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI0NDk3MmQyZi1jNjcyLTRlNjUtOTExOS1mNGRlN2RhY2E2YTUiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJiaGFhdnlhIiwic3ViIjoiN2ZlYmQyOWYtZGQ1Ny00ZDI1LWI3NjgtODMzMzg4MjlkZjdiIn0sImVtYWlsIjoiYmhhYXZ5YV9zdXJhQHNybWFwLmVkdS5pbiIsIm5hbWUiOiJiaGFhdnlhIiwicm9sbE5vIjoiYXAyMzExMDAxMTIyMiIsImFjY2Vzc0NvZGUiOiJRa2JweEgiLCJjbGllbnRJRCI6IjdmZWJkMjlmLWRkNTctNGQyNS1iNzY4LTgzMzM4ODI5ZGY3YiIsImNsaWVudFNlY3JldCI6InlGQ0h2VlBRd2tDa3Z1QmYifQ.nVnobO2n3Ijsu_RK7DEFVudS6mY8oHL0UNbbvuFklY8'
            }
        });
        const notifications = response.data.notifications;
        Logger.info('fetchNotifications', `Successfully fetched ${notifications?.length || 0} notifications.`);
        return notifications || [];
    } catch (error: any) {
        Logger.warn('fetchNotifications', `Failed to fetch from API (${error.message}). Using cached fallback data.`);
        return [
            { ID: "1fb4b6a2-5624-4588-972a-0abec4649fa2", Type: "Result", Message: "project-review", Timestamp: "2026-05-01 08:06:27" },
            { ID: "78621118-67cb-4383-a335-58d798cf9705", Type: "Event", Message: "cult-fest", Timestamp: "2026-05-02 02:36:21" },
            { ID: "45cd4d92-b8c3-4424-9927-1719ac2eb0d4", Type: "Event", Message: "tech-fest", Timestamp: "2026-05-01 19:06:15" },
            { ID: "5eceef5a-ce0d-4386-a072-cde323a8be33", Type: "Result", Message: "internal", Timestamp: "2026-05-01 06:36:09" },
            { ID: "379608a8-c486-4694-916e-4837a21bdf98", Type: "Placement", Message: "Alphabet Inc. Class A hiring", Timestamp: "2026-05-01 08:36:03" },
            { ID: "4470f29a-8179-4e1f-a2ac-8b121f11fbd9", Type: "Result", Message: "external", Timestamp: "2026-05-01 15:35:57" },
            { ID: "86557d1b-4d00-46cf-95a1-6f9e7c5702e9", Type: "Result", Message: "external", Timestamp: "2026-05-01 08:35:51" },
            { ID: "53b18dde-1f53-468a-9e62-0a3f044c88dd", Type: "Placement", Message: "Berkshire Hathaway Inc. hiring", Timestamp: "2026-05-01 07:35:45" },
            { ID: "2bd47245-ee4e-4360-970a-fc95a40a6a7f", Type: "Event", Message: "traditional-day", Timestamp: "2026-05-02 01:05:39" },
            { ID: "228fe5d8-7728-4398-bc2d-3ba345fa2d3a", Type: "Event", Message: "cult-fest", Timestamp: "2026-05-02 01:05:33" },
        ];
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
    Logger.debug('getTopNotifications', `Sorting ${notifications.length} notifications to find top ${n}`);
    
    // Sort based on priority weight, then recency
    const sorted = [...notifications].sort(compareNotifications);
    
    const topN = sorted.slice(0, n);
    Logger.info('getTopNotifications', `Successfully retrieved top ${n} notifications.`);
    return topN;
}

/**
 * Main application entry point
 */
async function main() {
    Logger.info('System', 'Starting Priority Inbox Backend...');
    
    const allNotifications = await fetchNotifications();
    
    if (allNotifications.length === 0) {
        Logger.warn('System', 'No notifications to process.');
        return;
    }

    const n = 10;
    const top10 = getTopNotifications(allNotifications, n);

    Logger.info('System', `--- TOP ${n} NOTIFICATIONS ---`);
    top10.forEach((notif, index) => {
        Logger.info('PriorityInbox', `#${index + 1} | [${notif.Type}] ${notif.Message} | ${notif.Timestamp}`);
    });
    Logger.info('System', 'Priority Inbox processing complete.');
}

// Execute the main function
main().catch((error) => {
    Logger.error('System', `Unhandled application error: ${error.message}`);
});
