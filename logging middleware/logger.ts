import axios from 'axios';

// Strict typing based on evaluation requirements
export type LogStack = 'backend' | 'frontend';
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type LogPackage = 
    | 'cache' | 'controller' | 'cron_job' | 'db' | 'domain' | 'handler' | 'repository' | 'route' | 'service' // backend
    | 'api' | 'component' | 'hook' | 'page' | 'state' | 'style' // frontend
    | 'auth' | 'config' | 'middleware' | 'utils'; // both

/**
 * Reusable Logging Middleware Function
 * Makes a POST request to the evaluation test server.
 */
export const Log = async (stack: LogStack, level: LogLevel, pkg: LogPackage, message: string) => {
    const payload = {
        stack,
        level,
        package: pkg,
        message
    };

    // Print to local console for debugging visibility
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${stack.toUpperCase()}] [${level.toUpperCase()}] [${pkg}] ${message}`;
    
    switch (level) {
        case 'info': console.info('\x1b[36m%s\x1b[0m', formattedMessage); break; // Cyan
        case 'warn': console.warn('\x1b[33m%s\x1b[0m', formattedMessage); break; // Yellow
        case 'error': console.error('\x1b[31m%s\x1b[0m', formattedMessage); break; // Red
        case 'fatal': console.error('\x1b[41m\x1b[37m%s\x1b[0m', formattedMessage); break; // White on Red
        case 'debug': console.debug('\x1b[90m%s\x1b[0m', formattedMessage); break; // Gray
        default: console.log(formattedMessage);
    }

    try {
        await axios.post('http://20.207.122.201/evaluation-service/logs', payload, {
            headers: {
                // Assuming we use the same pre-authorized Bearer token as the notification service
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJiaGFhdnlhX3N1cmFAc3JtYXAuZWR1LmluIiwiZXhwIjoxNzc3NzA0MjAyLCJpYXQiOjE3Nzc3MDMzMDIsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI0NDk3MmQyZi1jNjcyLTRlNjUtOTExOS1mNGRlN2RhY2E2YTUiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJiaGFhdnlhIiwic3ViIjoiN2ZlYmQyOWYtZGQ1Ny00ZDI1LWI3NjgtODMzMzg4MjlkZjdiIn0sImVtYWlsIjoiYmhhYXZ5YV9zdXJhQHNybWFwLmVkdS5pbiIsIm5hbWUiOiJiaGFhdnlhIiwicm9sbE5vIjoiYXAyMzExMDAxMTIyMiIsImFjY2Vzc0NvZGUiOiJRa2JweEgiLCJjbGllbnRJRCI6IjdmZWJkMjlmLWRkNTctNGQyNS1iNzY4LTgzMzM4ODI5ZGY3YiIsImNsaWVudFNlY3JldCI6InlGQ0h2VlBRd2tDa3Z1QmYifQ.nVnobO2n3Ijsu_RK7DEFVudS6mY8oHL0UNbbvuFklY8'
            }
        });
    } catch (error) {
        // Silently catch to prevent application crash if log server fails or token is expired
    }
};
