import UserRepository from '../repository/UserRepository';
import DIContainer from '../ioc/DIContainer';
import { injectable } from 'inversify';
import { Request, Response } from 'express';
import Crypt from '../crypto/crypt';
import { IUser } from '../types/SchemaTypes';

@injectable()
class UserController {
    userRepository: UserRepository;
    crypt: Crypt
    constructor() {
        this.userRepository = DIContainer.container.get(UserRepository);
        this.crypt = DIContainer.container.get(Crypt);
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

        Object.assign(req.body, {
            password: hashedPassword
        })

        await this.userRepository.saveUserToDB(req.body);

        res.status(201).json('User Successfully Created');

    }

}

export default UserController;