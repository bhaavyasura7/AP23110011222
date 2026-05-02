export enum LogLevel {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    DEBUG = 'DEBUG',
}

/**
 * Custom Logging Middleware
 * Requirement: "IT IS MANDATORY TO INTEGRATE THE LOGGING MIDDLEWARE FROM THE FIRST FUNCTION WRITTEN"
 */
export const Logger = {
    log: (level: LogLevel, context: string, message: string, data?: any) => {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            context,
            message,
            ...(data && { data }),
        };
        
        const formattedMessage = `[${timestamp}] [${level}] [${context}] ${message} ${data ? JSON.stringify(data) : ''}`;

        // Depending on the environment, we might want to write to a file, but for this test,
        // formatted console output is expected as the "custom logger" replacing native console logs.
        switch (level) {
            case LogLevel.INFO:
                console.info('\x1b[36m%s\x1b[0m', formattedMessage); // Cyan
                break;
            case LogLevel.WARN:
                console.warn('\x1b[33m%s\x1b[0m', formattedMessage); // Yellow
                break;
            case LogLevel.ERROR:
                console.error('\x1b[31m%s\x1b[0m', formattedMessage); // Red
                break;
            case LogLevel.DEBUG:
                console.debug('\x1b[90m%s\x1b[0m', formattedMessage); // Gray
                break;
            default:
                console.log(formattedMessage);
        }
    },
    info: (context: string, message: string, data?: any) => Logger.log(LogLevel.INFO, context, message, data),
    warn: (context: string, message: string, data?: any) => Logger.log(LogLevel.WARN, context, message, data),
    error: (context: string, message: string, data?: any) => Logger.log(LogLevel.ERROR, context, message, data),
    debug: (context: string, message: string, data?: any) => Logger.log(LogLevel.DEBUG, context, message, data),
};
