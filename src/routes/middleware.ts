import { Request, Response, NextFunction } from 'express';
import { injectable } from 'inversify';

@injectable()
class Middleware {
    constructor() { }

    verifySession = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.session.email) {
            return res.redirect('/login');
        } else {
            next();
        }
    }
}

export default Middleware;