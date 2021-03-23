import mongoose, { CallbackError } from 'mongoose';
import config from 'config';
import puppeteer, { Browser } from 'puppeteer';

let browser: Browser = undefined;

const connectToDB = async () => {

    const uri: string = config.get<string>("mongoUri");
    const db = mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => console.log(`Connected to MongoDB successfully`))
        .catch(err => console.log(err))

}

const puppeteerLaunch = async () => {
    browser = await puppeteer.launch();
    console.log(`Puppeteer launched`);
}

export { connectToDB, puppeteerLaunch, browser };