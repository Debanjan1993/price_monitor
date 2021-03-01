import { injectable } from "inversify";
import User from '../schema/user'
import { IUser } from "../types/SchemaTypes";

@injectable()
class UserRepository {
    constructor() { }

    getUserByEmail = async (email: string) => {
        return User.findOne({ email: email }).exec();
    }

    getFreeUsers = async (skip: number, take: number) => {
        return User.find({ isPaidUser: false }, null, { skip: skip, limit: take }).exec();
    }

    getFreeUserCount = async () => {
        return User.countDocuments({ isPaidUser: false }).exec();
    }

    saveUserToDB = async (userObj: IUser) => {
        const user = new User(userObj);
        return await user.save()
    }

}

export default UserRepository;