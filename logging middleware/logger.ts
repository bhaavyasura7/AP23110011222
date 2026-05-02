/**
 * Logging Middleware
 * Reusable Log function that POSTs to the evaluation log server.
 * Function signature: Log(stack, level, package, message)
 *
 * Stack values:   "backend" | "frontend"
 * Level values:   "debug" | "info" | "warn" | "error" | "fatal"
 * Package values:
 *   Backend:   cache, controller, cron_job, db, domain, handler, repository, route, service
 *   Frontend:  api, component, hook, page, state, style
 *   Both:      auth, config, middleware, utils
 */

const LOG_API_URL = 'http://20.207.122.201/evaluation-service/logs';
const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJiaGFhdnlhX3N1cmFAc3JtYXAuZWR1LmluIiwiZXhwIjoxNzc3NzA0MjAyLCJpYXQiOjE3Nzc3MDMzMDIsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI0NDk3MmQyZi1jNjcyLTRlNjUtOTExOS1mNGRlN2RhY2E2YTUiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJiaGFhdnlhIiwic3ViIjoiN2ZlYmQyOWYtZGQ1Ny00ZDI1LWI3NjgtODMzMzg4MjlkZjdiIn0sImVtYWlsIjoiYmhhYXZ5YV9zdXJhQHNybWFwLmVkdS5pbiIsIm5hbWUiOiJiaGFhdnlhIiwicm9sbE5vIjoiYXAyMzExMDAxMTIyMiIsImFjY2Vzc0NvZGUiOiJRa2JweEgiLCJjbGllbnRJRCI6IjdmZWJkMjlmLWRkNTctNGQyNS1iNzY4LTgzMzM4ODI5ZGY3YiIsImNsaWVudFNlY3JldCI6InlGQ0h2VlBRd2tDa3Z1QmYifQ.nVnobO2n3Ijsu_RK7DEFVudS6mY8oHL0UNbbvuFklY8';

export type LogStack = 'backend' | 'frontend';
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type LogPackage =
    // Backend-only
    | 'cache' | 'controller' | 'cron_job' | 'db' | 'domain'
    | 'handler' | 'repository' | 'route' | 'service'
    // Frontend-only
    | 'api' | 'component' | 'hook' | 'page' | 'state' | 'style'
    // Shared
    | 'auth' | 'config' | 'middleware' | 'utils';

/**
 * Core log function that matches the required signature:
 * Log(stack, level, package, message)
 * Sends log to remote API and also prints to console.
 */
export async function Log(
    stack: LogStack,
    level: LogLevel,
    pkg: LogPackage,
    message: string
): Promise<void> {
    const timestamp = new Date().toISOString();

    // Console output with color coding
    const colorMap: Record<LogLevel, string> = {
        debug: '\x1b[90m',  // Gray
        info:  '\x1b[36m',  // Cyan
        warn:  '\x1b[33m',  // Yellow
        error: '\x1b[31m',  // Red
        fatal: '\x1b[35m',  // Magenta
    };
    const reset = '\x1b[0m';
    const color = colorMap[level] || '';
    console.log(`${color}[${timestamp}] [${level.toUpperCase()}] [${stack}/${pkg}] ${message}${reset}`);

    // POST to remote logging API (fire-and-forget, does not block application)
    try {
        const body = JSON.stringify({ stack, level, package: pkg, message });

        // Use fetch if available (browser/modern Node), else fall back to http module
        if (typeof fetch !== 'undefined') {
            fetch(LOG_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${BEARER_TOKEN}`,
                },
                body,
            }).catch(() => { /* silently ignore remote log failures */ });
        } else {
            // Node.js fallback using built-in https module
            const url = new URL(LOG_API_URL);
            const http = require(url.protocol === 'https:' ? 'https' : 'http');
            const req = http.request({
                hostname: url.hostname,
                port: url.port || (url.protocol === 'https:' ? 443 : 80),
                path: url.pathname,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${BEARER_TOKEN}`,
                    'Content-Length': Buffer.byteLength(body),
                },
            });
            req.on('error', () => { /* silently ignore */ });
            req.write(body);
            req.end();
        }
    } catch {
        // Never let logging failures break the application
    }
}

/**
 * Convenience Logger object for backward-compatible usage throughout the app.
 * Maps to the correct stack and package automatically.
 *
 * Usage: Logger.info('ComponentName', 'message')
 */
export const Logger = {
    _log: (level: LogLevel, stack: LogStack, pkg: LogPackage, context: string, message: string) => {
        Log(stack, level, pkg, `[${context}] ${message}`);
    },
    info:  (context: string, message: string) => Log('frontend', 'info',  'component', `[${context}] ${message}`),
    warn:  (context: string, message: string) => Log('frontend', 'warn',  'component', `[${context}] ${message}`),
    error: (context: string, message: string) => Log('frontend', 'error', 'component', `[${context}] ${message}`),
    debug: (context: string, message: string) => Log('frontend', 'debug', 'component', `[${context}] ${message}`),

    // Backend-specific helpers
    backend: {
        info:  (pkg: LogPackage, context: string, message: string) => Log('backend', 'info',  pkg, `[${context}] ${message}`),
        warn:  (pkg: LogPackage, context: string, message: string) => Log('backend', 'warn',  pkg, `[${context}] ${message}`),
        error: (pkg: LogPackage, context: string, message: string) => Log('backend', 'error', pkg, `[${context}] ${message}`),
        debug: (pkg: LogPackage, context: string, message: string) => Log('backend', 'debug', pkg, `[${context}] ${message}`),
        fatal: (pkg: LogPackage, context: string, message: string) => Log('backend', 'fatal', pkg, `[${context}] ${message}`),
    },
};
