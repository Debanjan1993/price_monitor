import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import Routes from './routes/routes';
import DIContainer from './ioc/DIContainer';
import connectToDB from './connecToDB';
import session from 'express-session';
import config from 'config';
import path from 'path';

(async function () {

    const app = express();
    const port = process.env.PORT || 4000;

    app.use(bodyParser.json());
    app.use(express.static(path.join(__dirname, '../public')))

    await connectToDB();

    app.use(session({
        secret: config.get<string>("sessionKey"),
        resave: false,
        saveUninitialized: false
    }))

    // console.log(path.join(__dirname, '../public'));

    await DIContainer.instance.init();

    const routes = DIContainer.container.get(Routes);
    routes.init(app);

    app.listen(port, () => console.log(`App started on port ${port}`));

})()