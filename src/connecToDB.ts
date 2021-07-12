import mongoose, { CallbackError } from 'mongoose';
import config from 'config';
import puppeteer, { Browser } from 'puppeteer';
import logger from 'pino';

let browser: Browser = undefined;

const connectToDB = async () => {

    const uri: string = config.get<string>("mongoUri");
    const db = mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => logger().info(`Connected to MongoDB successfully`))
        .catch(err => logger().error(err))

}

const puppeteerLaunch = async () => {
    browser = await puppeteer.launch();
    logger().info(`Puppeteer launched`);
}

export { connectToDB, puppeteerLaunch, browser };