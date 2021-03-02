import { Router, Request, Response, Application } from 'express';
import { injectable } from 'inversify';
import UserController from '../controllers/Usercontroller';
import DIContainer from '../ioc/DIContainer';
import path from 'path';
import Middleware from './middleware';

@injectable()
class Routes {
    router: Router
    userController: UserController
    middleware: Middleware
    constructor() {
        this.router = DIContainer.container.get(Router);
        this.userController = DIContainer.container.get(UserController);
        this.middleware = DIContainer.container.get(Middleware);
    }

    init = (app: Application) => {

        this.router.get('/login', (req: Request, res: Response) => {
            res.sendFile(path.join(__dirname, '../../public/login.html'));
        })

        this.router.get('/signUp', (req: Request, res: Response) => {
            res.sendFile(path.join(__dirname, '../../public/register.html'));
        })

        this.router.get('/dashboard', this.middleware.verifySession, (req: Request, res: Response) => {
            res.sendFile(path.join(__dirname, '../../public/dashboard.html'));
        })

        this.router.post('/api/login', async (req: Request, res: Response) => {
            await this.userController.verifyUser(req, res);
        })

        this.router.post('/api/signup', async (req: Request, res: Response) => {
            await this.userController.addUser(req, res);
        })

        this.router.post('/api/logout', async (req: Request, res: Response) => {
            await this.userController.logout(req, res);
        })

        this.router.get('/test', (req: Request, res: Response) => {
            res.status(200).json('Test Successsful');
        });

        app.use('/', this.router);

    }
}

export default Routes;