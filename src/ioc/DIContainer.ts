import { Router } from 'express';
import { Container } from 'inversify';
import UserController from '../controllers/Usercontroller';
import Crypt from '../crypto/crypt';
import LinksRepository from '../repository/LinksRepository';
import UserRepository from '../repository/UserRepository';
import Middleware from '../routes/middleware';
import Routes from '../routes/routes';
import LinkController from '../controllers/LinkController';
import SQSService from '../SQSService';
import MailJob from '../jobs/MailJob';
import CheckPrice from '../jobs/CheckPriceJob';
import PollingJob from '../jobs/PollingJob';
import QueueProcessor from '../queueProcessor';
import JobLogger from '../Logger';

class DIContainer {

    private static _instance: DIContainer;
    private static _container: Container;

    static get instance() {
        if (!DIContainer._instance) {
            DIContainer._instance = new DIContainer();
        }
        return DIContainer._instance;
    }

    static get container() {
        return DIContainer._container;
    }


    init = async () => {
        if (!DIContainer._container) {
            const container = new Container();

            container.bind<Routes>(Routes).toSelf();
            container.bind<UserRepository>(UserRepository).toSelf();
            container.bind<Crypt>(Crypt).toSelf();
            container.bind<UserController>(UserController).toSelf();
            container.bind<Middleware>(Middleware).toSelf();
            container.bind<LinksRepository>(LinksRepository).toSelf();
            container.bind<LinkController>(LinkController).toSelf();
            container.bind<SQSService>(SQSService).toSelf();
            container.bind<QueueProcessor>(QueueProcessor).toSelf();
            container.bind<JobLogger>(JobLogger).toSelf();

            container.bind<MailJob>(MailJob).toSelf();
            container.bind<CheckPrice>(CheckPrice).toSelf();
            container.bind<PollingJob>(PollingJob).toSelf();

            const router = Router();
            container.bind<Router>(Router).toConstantValue(router);

            DIContainer._container = container;
        }
    }

}

export default DIContainer;

