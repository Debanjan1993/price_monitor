import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import Routes from './routes/routes';
import DIContainer from './ioc/DIContainer';
import connectToDB from './connecToDB';

(async function () {

    const app = express();
    const port = process.env.PORT || 4000;

    await connectToDB();
    await DIContainer.instance.init();

    const routes = DIContainer.container.get(Routes);

    routes.init(app);

    app.listen(port, () => console.log(`App started on port ${port}`));

})()