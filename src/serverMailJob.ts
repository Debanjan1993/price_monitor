import { connectToDB } from './connecToDB';
import { enableTransporter } from './Mail';
import DIContainer from './ioc/DIContainer';
import { CronJob } from 'cron';
import QueueProcessor from './queueProcessor';
import logger from 'pino';

(async function () {
    try {
        await connectToDB();
        await enableTransporter();

        await DIContainer.instance.init();

        const queueProcessor = DIContainer.container.get(QueueProcessor);
        await queueProcessor.getQueueURL();

        new CronJob('*/20 * * * * *', async () => {
            await queueProcessor.userMail();
        })

        new CronJob('*/20 * * * * *', async () => {
            await queueProcessor.confirmationMail();
        })
    } catch (err) {
        logger().error(`Exception occurred while running the Mail Job : ${err}`);
    }

})();