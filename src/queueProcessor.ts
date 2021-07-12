import DIContainer from "./ioc/DIContainer";
import SQSService from "./SQSService";
import { QueueNames } from './util/util';
import { GetQueueUrlResult, ReceiveMessageResult } from 'aws-sdk/clients/sqs';
import MailJob from "./jobs/MailJob";
import CheckPrice from "./jobs/CheckPriceJob";
import { injectable } from "inversify";

@injectable()
class QueueProcessor {

    private sqsService: SQSService;
    private userMailQueueURL: string;
    private checkPriceQueueURL: string;
    private confirmationEmailQueueURL: string;
    private userMailJob: MailJob;
    private checkPriceJob: CheckPrice;

    constructor() {
        this.sqsService = DIContainer.container.get(SQSService);
        this.userMailJob = DIContainer.container.get(MailJob);
        this.checkPriceJob = DIContainer.container.get(CheckPrice);
    }

    getQueueURL = async () => {
        this.userMailQueueURL = (await this.sqsService.getQueueURL(QueueNames.mailUser) as GetQueueUrlResult).QueueUrl;
        this.checkPriceQueueURL = (await this.sqsService.getQueueURL(QueueNames.checkPrice) as GetQueueUrlResult).QueueUrl;
        this.confirmationEmailQueueURL = (await this.sqsService.getQueueURL(QueueNames.confirmationMail) as GetQueueUrlResult).QueueUrl;
    }

    userMail = async () => {
        try {
            const messageResponse = await this.sqsService.getMessage(this.userMailQueueURL, 1) as ReceiveMessageResult;
            const messages = messageResponse.Messages;
            if (messages.length) {
                await Promise.all(messages.map(async message => {
                    const messageBody = JSON.parse(message.Body);
                    await this.userMailJob.run(messageBody);
                }));
            }
        } catch (e) {
            console.error(`Unable to get messages from AWS for queueURL :${this.userMailQueueURL}`);
        }
    }

    checkPrice = async () => {
        try {
            const messageResponse = await this.sqsService.getMessage(this.checkPriceQueueURL, 1) as ReceiveMessageResult;
            const messages = messageResponse.Messages;
            if (messages.length) {
                await Promise.all(messages.map(async message => {
                    const messageBody = JSON.parse(message.Body);
                    await this.checkPriceJob.run(messageBody);
                }));
            }
        } catch (e) {
            console.error(`Unable to get messages from AWS for queueURL :${this.userMailQueueURL}`);
        }
    }

    confirmationMail = async () => {
        try {
            const messageResponse = await this.sqsService.getMessage(this.confirmationEmailQueueURL, 1) as ReceiveMessageResult;
            const messages = messageResponse.Messages;
            if (messages.length) {
                await Promise.all(messages.map(async message => {
                    const messageBody = JSON.parse(message.Body);
                    await this.userMailJob.confirmationMail(messageBody);
                }));
            }
        } catch (e) {
            console.error(`Unable to get messages from AWS for queueURL :${this.userMailQueueURL}`);
        }
    }
}

export default QueueProcessor;