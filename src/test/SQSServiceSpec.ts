import { describe } from "mocha";
import SQSService from '../SQSService'
import logger from 'pino';

describe('SQS Service', () => {
    it('Put message in queue', () => {
        logger().info('abcd');
    })
})