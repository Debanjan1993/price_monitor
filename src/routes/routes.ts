import { Router, Request, Response, Application } from 'express';
import { injectable } from 'inversify';
import UserController from '../controllers/Usercontroller';
import DIContainer from '../ioc/DIContainer';

@injectable()
class Routes {
    router: Router
    userController: UserController
    constructor() {
        this.router = DIContainer.container.get(Router);
        this.userController = DIContainer.container.get(UserController);
    }

    init = (app: Application) => {

        this.router.get('/test', (req: Request, res: Response) => {
            res.status(200).json('Test Successsful');
        });

        this.router.post('/api/signup', async (req: Request, res: Response) => {
            await this.userController.addUser(req, res);
        })

        app.use('/', this.router);

    }
}

export default Routes;