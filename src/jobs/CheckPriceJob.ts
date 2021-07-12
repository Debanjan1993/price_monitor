import { injectable } from 'inversify';
import { Browser } from 'puppeteer';
import { PollMsgBody } from '../types/Intefaces';
import DIContainer from '../ioc/DIContainer'
import SQSService from '../SQSService';
import { urlfilter } from '../util/util';
import { browser } from '../connecToDB'
import JobLogger from '../Logger';

@injectable()
class CheckPrice {
    queueName = 'Mail_User'
    sqsService: SQSService;
    jobLogger: JobLogger;
    jobName: string = "Check Price Job";
    constructor() {
        this.sqsService = DIContainer.container.get(SQSService);
        this.jobLogger = DIContainer.container.get(JobLogger);
    }

    run = async (msgBody: PollMsgBody) => {
        this.jobLogger.info(this.jobName, `Check Price Job Started`);
        await this.checkPrice(msgBody);
        this.jobLogger.info(this.jobName, 'Check Price Job Ended');

    }

    checkPrice = async (msgBody: PollMsgBody) => {

        const url = msgBody.link.url;
        const priceElement = await urlfilter(url);

        if (!priceElement) {
            this.jobLogger.error(this.jobName, `Site not found`);
            return;
        }

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        const tempPrice = await page.evaluate(() => {
            const price = (document.querySelector(priceElement) as HTMLElement).innerText;
            const formattedPrice = price.replace(/[^0-9.-]+/g, "");
            return <number>(<unknown>formattedPrice);
        });

        if (tempPrice < msgBody.link.price) {
            await this.sqsService.sendMessage(this.queueName, msgBody, false);
        }

        await page.goto('about:blank');
        await page.close();

    }

}

export default CheckPrice;