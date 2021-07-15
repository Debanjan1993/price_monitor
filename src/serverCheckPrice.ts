import "reflect-metadata";
import { connectToDB, puppeteerLaunch } from './connecToDB';
import DIContainer from './ioc/DIContainer';
import QueueProcessor from './queueProcessor';
import { CronJob } from 'cron';
import logger from 'pino';

(async function () {

    try {
        await connectToDB();
        await puppeteerLaunch();

        await DIContainer.instance.init();

        const queueProcessor = DIContainer.container.get(QueueProcessor);
        await queueProcessor.getQueueURL();

        new CronJob('*/20 * * * * *', async () => {
            await queueProcessor.checkPrice();
        })
    } catch (err) {
        logger().error(`Exception while running the Check Price Job : ${err}`);
    }
})()