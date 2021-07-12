import { AWSError, SQS } from 'aws-sdk';
import { CreateQueueRequest, CreateQueueResult, DeleteQueueRequest, GetQueueUrlRequest, GetQueueUrlResult, ReceiveMessageRequest, ReceiveMessageResult, SendMessageRequest, SendMessageResult } from 'aws-sdk/clients/sqs';
import config from 'config';
import { injectable } from 'inversify';
import JobLogger from './Logger';
import DIContainer from './ioc/DIContainer';

@injectable()
class SQSService {
    sqs: SQS;
    jobLogger: JobLogger;
    jobName: string = "SQS Service"
    constructor() {
        this.sqs = new SQS({
            accessKeyId: config.get<string>('sqs.accessKeyId'),
            secretAccessKey: config.get<string>('sqs.secretAccessKey'),
            region: config.get<string>('sqs.region'),
            correctClockSkew: true
        });
        this.jobLogger = DIContainer.container.get(JobLogger);
    }

    createStandardQueue = async (queueName: string) => {

        const params: CreateQueueRequest = {
            QueueName: queueName,
            Attributes: {
                ReceiveMessageWaitTimeSeconds: '10'
            }
        };

        return new Promise<any>((resolve, reject) => {
            this.sqs.createQueue(params, (err: AWSError, data: CreateQueueResult) => {
                if (err) {
                    this.jobLogger.error(this.jobName, `Error creating standard queue ${err}`);
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })

    };


    createFIFOQueue = async (queueName: string) => {
        const params: CreateQueueRequest = {
            QueueName: queueName,
            Attributes: {
                FifoQueue: 'true'
            }
        }

        return new Promise((resolve, reject) => {
            this.sqs.createQueue(params, (err: AWSError, data: CreateQueueResult) => {
                if (err) {
                    this.jobLogger.error(this.jobName, `Error creating FIFO queue`);
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })

    }

    deleteQueue = async (queueURL: string) => {
        const params: DeleteQueueRequest = {
            QueueUrl: queueURL
        }

        return new Promise((resolve, reject) => {
            this.sqs.deleteQueue(params, (err, data) => {
                if (err) {
                    this.jobLogger.error(this.jobName, `Error deleting Queue ${queueURL}`);
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })

    }

    sendMessage = async (queueName: string, data: any, isFifo: boolean): Promise<AWSError | SendMessageResult> => {
        let result: CreateQueueResult | GetQueueUrlResult = undefined;
        try {
            result = await this.getQueueURL(queueName) as GetQueueUrlResult;
        } catch (e) {
            if (e.code === 'AWS.SimpleQueueService.NonExistentQueue') {
                if (isFifo) {
                    result = await this.createFIFOQueue(queueName);
                } else {
                    result = await this.createStandardQueue(queueName);
                }
            } else {
                throw (e);
            }
        }

        const params: SendMessageRequest = {
            QueueUrl: result.QueueUrl,
            MessageBody: JSON.stringify(data),
        }

        if (isFifo) {
            params['MessageGroupId'] = 'messageQueue'
            params['MessageDeduplicationId'] = ''
        }


        return new Promise((resolve, reject) => {
            this.sqs.sendMessage(params, (err: AWSError, data: SendMessageResult) => {
                if (err) {
                    this.jobLogger.error(this.jobName, `Error while sending message to queue ${queueName}`);
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })
    }

    getMessage = async (queueURL: string, messageCount: number, visibilityTimeout: number = 3600): Promise<ReceiveMessageResult | AWSError> => {
        const params: ReceiveMessageRequest = {
            QueueUrl: queueURL,
            MaxNumberOfMessages: messageCount,
            VisibilityTimeout: visibilityTimeout
        }

        return new Promise((resolve, reject) => {
            this.sqs.receiveMessage(params, (err: AWSError, data: ReceiveMessageResult) => {
                if (err) {
                    this.jobLogger.error(this.jobName, `Error while receiving message from queue`);
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })
    }


    getQueueURL = async (queueName: string): Promise<GetQueueUrlResult | AWSError> => {

        const params: GetQueueUrlRequest = {
            QueueName: queueName
        }
        return new Promise((resolve, reject) => {
            this.sqs.getQueueUrl(params, (err: AWSError, data: GetQueueUrlResult) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data)
                }
            })
        })

    }

}

export default SQSService;