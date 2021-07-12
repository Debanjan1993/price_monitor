import { connectToDB } from './connecToDB';
import DIContainer from './ioc/DIContainer';
import { CronJob } from 'cron';
import PollingJob from './jobs/PollingJob';
import logger from 'pino';

(async function () {
    try {
        await connectToDB();
        await DIContainer.instance.init();

        const pollingJob = DIContainer.container.get(PollingJob);

        new CronJob('*/20 * * * * *', async () => {
            await pollingJob.run();
        })
    } catch (err) {
        logger().error(`Exception while running the Polling Job : ${err}`);
    }

})()