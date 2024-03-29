import { Router, Request, Response, Application } from 'express';
import { injectable } from 'inversify';
import UserController from '../controllers/Usercontroller';
import DIContainer from '../ioc/DIContainer';
import path from 'path';
import Middleware from './middleware';
import LinkController from '../controllers/LinkController';

@injectable()
class Routes {
    router: Router
    userController: UserController
    middleware: Middleware
    linkController: LinkController
    constructor() {
        this.router = DIContainer.container.get(Router);
        this.userController = DIContainer.container.get(UserController);
        this.middleware = DIContainer.container.get(Middleware);
        this.linkController = DIContainer.container.get(LinkController);
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

        this.router.get('/account', this.middleware.verifySession, (req: Request, res: Response) => {
            res.sendFile(path.join(__dirname, '../../public/account.html'));
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

        this.router.get('/api/userDetails', async (req: Request, res: Response) => {
            await this.userController.userDetails(req, res);
        })

        this.router.post('/api/updateInfo', async (req: Request, res: Response) => {
            await this.userController.updateInfo(req, res);
        })

        this.router.get('/api/confirmationMail/:code', async (req: Request, res: Response) => {
            await this.userController.getUserConfirmation(req, res);
        })

        this.router.post('/addLink', async (req: Request, res: Response) => {
            await this.linkController.createLink(req, res);
        })

        this.router.post('/deleteLink', async (req: Request, res: Response) => {
            await this.linkController.deleteLink(req, res);
        })

        this.router.get('/test', (req: Request, res: Response) => {
            res.status(200).json('Test Successsful');
        });

        app.use('/', this.router);

    }
}

export default Routes;