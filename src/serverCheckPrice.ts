import { connectToDB, puppeteerLaunch } from './connecToDB';
import DIContainer from './ioc/DIContainer';
import QueueProcessor from './queueProcessor';
import { CronJob } from 'cron';

(async function () {

    await connectToDB();
    await puppeteerLaunch();

    await DIContainer.instance.init();

    const queueProcessor = DIContainer.container.get(QueueProcessor);
    await queueProcessor.getQueueURL();

    new CronJob('*/20 * * * * *', async () => {
        await queueProcessor.checkPrice();
    })

})()