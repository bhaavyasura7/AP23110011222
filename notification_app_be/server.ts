import express from 'express';
import cors from 'cors';
import axios from 'axios';
// @ts-ignore
import { Logger } from '../logging middleware/logger';

const app = express();
const PORT = 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.get('/api/notifications', async (req, res) => {
    try {
        Logger.backend.info('route', 'Proxy', `Received request for notifications. Query: ${JSON.stringify(req.query)}`);
        
        let url = 'http://20.207.122.201/evaluation-service/notifications';
        
        // Forward all query parameters (e.g. limit=10, notification_type=Event)
        const queryParams = new URLSearchParams(req.query as Record<string, string>).toString();
        if (queryParams) {
            url += `?${queryParams}`;
        }

        Logger.backend.info('route', 'Proxy', `Forwarding request to: ${url}`);

        const response = await axios.get(url, {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJiaGFhdnlhX3N1cmFAc3JtYXAuZWR1LmluIiwiZXhwIjoxNzc3NzA0MjAyLCJpYXQiOjE3Nzc3MDMzMDIsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI0NDk3MmQyZi1jNjcyLTRlNjUtOTExOS1mNGRlN2RhY2E2YTUiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJiaGFhdnlhIiwic3ViIjoiN2ZlYmQyOWYtZGQ1Ny00ZDI1LWI3NjgtODMzMzg4MjlkZjdiIn0sImVtYWlsIjoiYmhhYXZ5YV9zdXJhQHNybWFwLmVkdS5pbiIsIm5hbWUiOiJiaGFhdnlhIiwicm9sbE5vIjoiYXAyMzExMDAxMTIyMiIsImFjY2Vzc0NvZGUiOiJRa2JweEgiLCJjbGllbnRJRCI6IjdmZWJkMjlmLWRkNTctNGQyNS1iNzY4LTgzMzM4ODI5ZGY3YiIsImNsaWVudFNlY3JldCI6InlGQ0h2VlBRd2tDa3Z1QmYifQ.nVnobO2n3Ijsu_RK7DEFVudS6mY8oHL0UNbbvuFklY8'
            }
        });

        Logger.backend.info('route', 'Proxy', `Successfully fetched ${response.data.notifications?.length || 0} items from API.`);
        res.json(response.data);
    } catch (error: any) {
        Logger.backend.error('route', 'Proxy', `Failed to fetch from live API: ${error.message}`);
        
        // Check if token might be expired or if it's a network error
        if (error.response?.status === 401) {
            res.status(401).json({ error: 'Backend token expired.' });
        } else {
            res.status(500).json({ error: 'Unable to load notifications.' });
        }
    }
});

app.listen(PORT, () => {
    Logger.backend.info('service', 'Server', `Backend proxy server listening on http://localhost:${PORT}`);
});
