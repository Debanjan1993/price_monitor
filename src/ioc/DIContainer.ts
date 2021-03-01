import { Router } from 'express';
import { Container } from 'inversify';
import UserController from '../controllers/Usercontroller';
import Crypt from '../crypto/crypt';
import UserRepository from '../repository/UserRepository';
import Routes from '../routes/routes';

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

            const router = Router();
            container.bind<Router>(Router).toConstantValue(router);

            DIContainer._container = container;
        }
    }

}

export default DIContainer;

