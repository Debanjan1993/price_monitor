import UserRepository from '../repository/UserRepository';
import DIContainer from '../ioc/DIContainer';
import { injectable } from 'inversify';
import { Request, Response } from 'express';
import Crypt from '../crypto/crypt';
import { ILink, IUser } from '../types/SchemaTypes';
import moment from 'moment';
import LinksRepository from '../repository/LinksRepository';

@injectable()
class UserController {
    userRepository: UserRepository;
    crypt: Crypt;
    linksRepository: LinksRepository;
    constructor() {
        this.userRepository = DIContainer.container.get(UserRepository);
        this.crypt = DIContainer.container.get(Crypt);
        this.linksRepository = DIContainer.container.get(LinksRepository);
    }

    addUser = async (req: Request, res: Response) => {
        const { personName, email, password, password2 } = req.body;

        if (!personName) {
            return res.status(400).json('Please enter the name');
        }
        if (!email) {
            return res.status(400).json('Please enter the email');
        }
        if (!password) {
            return res.status(400).json('Please enter the password');
        }
        if (!password2) {
            return res.status(400).json('Please confirm the password by entering again');
        }

        if (password !== password2) {
            return res.status(400).json('The password entered do not match with each other');
        }

        const user = await this.userRepository.getUserByEmail(email);

        if (user) {
            return res.status(400).json('User with this email already exists');
        }

        const hashedPassword = await this.crypt.createCrypt(password);

        const dbObj: Partial<IUser> = {
            username: personName,
            email: email,
            password: hashedPassword,
            dateOfJoining: moment().unix(),
            isPaidUser: false
        }

        await this.userRepository.saveUserToDB(dbObj as IUser);

        res.status(201).json('User Successfully Created');

    }

    verifyUser = async (req: Request, res: Response) => {
        const { username, password } = req.body;
        if (!username) {
            return res.status(400).json('Please enter the username');
        }
        if (!password) {
            return res.status(400).json('Please enter the password');
        }

        const user = await this.userRepository.getUserByEmail(username);

        if (!user) {
            return res.status(400).json('No user exists with the entered email please sign up now');
        }

        const dbPassword = user.password;

        const isMatched = await this.crypt.comparePassword(password, dbPassword);

        if (!isMatched) {
            return res.status(401).json('The password entered is not correct');
        }

        req.session.email = username
        return res.status(200).json('Signed In');

    }

    logout = async (req: Request, res: Response) => {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json('Internal server Error');
            } else {
                return res.redirect('/login');
            }
        })
    }

    userDetails = async (req: Request, res: Response) => {
        const email = req.session.email;
        const user = await this.userRepository.getUserByEmail(email);
        const linkIds = user.links;
        const links: ILink[] = await this.linksRepository.getLinksByID(linkIds);
        const userObj = {
            user :user,
            links : links
        }
        return res.status(200).json(userObj);
    }

}

export default UserController;