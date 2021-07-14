import logger from 'pino';
import { injectable } from 'inversify';


@injectable()
class JobLogger {

    constructor() { }

    info = (jobName: string, message: string) => {
        logger().info(`${jobName} : ${message}`);
    }

    warn = (jobName: string, message: string, exception?: Error) => {
        exception ? logger().warn(`${jobName} : ${message}`, exception.stack) : logger().warn(message);
    }

    error = (jobName: string, message: string, exception?: Error) => {
        exception ? logger().error(`${jobName} : ${message}`, exception.stack) : logger().error(message);
    }

    debug = (jobName: string, message: string) => {
        logger().debug(`${jobName} : ${message}`);
    }

}

export default JobLogger;
