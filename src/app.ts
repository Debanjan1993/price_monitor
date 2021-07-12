import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import Routes from './routes/routes';
import DIContainer from './ioc/DIContainer';
import { connectToDB } from './connecToDB';
import session from 'express-session';
import config from 'config';
import path from 'path';
import MongoStore from 'connect-mongo';
import logger from 'pino';

(async function () {

    try {
        const app = express();
        const port = process.env.PORT || 4000;

        app.use(bodyParser.json());
        app.use(express.static(path.join(__dirname, '../public')))

        await connectToDB();

        const sessionStore: MongoStore = MongoStore.create({
            mongoUrl: config.get<string>("mongoUri"),
            collectionName: 'sessions'
        })

        app.use(session({
            store: sessionStore,
            secret: config.get<string>("sessionKey"),
            resave: false,
            saveUninitialized: false
        }))

        await DIContainer.instance.init();

        const routes = DIContainer.container.get(Routes);
        routes.init(app);

        app.listen(port, () => logger().info(`App started on port ${port}`));
    } catch (err) {
        logger().error(`Exception while running application : ${err}`);
    }

})()