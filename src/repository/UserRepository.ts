import { injectable } from "inversify";
import User from '../schema/user'
import { IUser } from "../types/SchemaTypes";

@injectable()
class UserRepository {
    constructor() { }

    getUserByEmail = async (email: string) => {
        return await User.findOne({ email: email }).exec();
    }

    getFreeUsers = async (skip: number, take: number) => {
        return await User.find({ isPaidUser: false }, null, { skip: skip, limit: take }).exec();
    }

    getFreeUserCount = async () => {
        return await User.countDocuments({ isPaidUser: false }).exec();
    }

    saveUserToDB = async (userObj: IUser) => {
        const user = new User(userObj);
        return await user.save()
    }

    updateUserInfo = async (originalEmail: string, userObj: IUser) => {
        return await User.updateOne({
            email: originalEmail
        }, {
            username: userObj.username,
            email: userObj.email,
            password: userObj.password
        })
    }

    getAllUsersCount = async () => {
        return await User.countDocuments().exec();
    }

    getUsers = async (skip: number, take: number) => {
        return await User.find({}, null, {
            skip: skip,
            limit: take
        })
    }

    updateUserConfirmationStatus = async (email: string) => {
        return await User.updateOne({
            email: email
        }, {
            isVerified: true
        })
    }

}

export default UserRepository;