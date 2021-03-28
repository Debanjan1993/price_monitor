import { injectable } from 'inversify';
import { Browser } from 'puppeteer';
import { PollMsgBody } from '../types/Intefaces';
import DIContainer from '../ioc/DIContainer'
import SQSService from '../SQSService';
import { urlfilter } from '../util/util';
import { browser } from '../connecToDB'

@injectable()
class CheckPrice {
    queueName = 'Mail_User'
    sqsService: SQSService;
    constructor() {
        this.sqsService = DIContainer.container.get(SQSService);
    }

    run = async (msgBody: PollMsgBody) => {
        console.log(`Check Price Job Started`);
        await this.checkPrice(msgBody);
        console.log('Check Price Job Ended');

    }

    checkPrice = async (msgBody: PollMsgBody) => {

        const url = msgBody.link.url;
        const priceElement = await urlfilter(url);

        if (!priceElement) {
            console.log(`Site not found`);
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