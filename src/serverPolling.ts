import { connectToDB } from './connecToDB';
import DIContainer from './ioc/DIContainer';
import { CronJob } from 'cron';
import PollingJob from './jobs/PollingJob';

(async function () {

    await connectToDB();
    await DIContainer.instance.init();

    const pollingJob = DIContainer.container.get(PollingJob);

    new CronJob('*/20 * * * * *', async () => {
        await pollingJob.run();
    })

})()