import { Document } from 'mongoose';

interface IUser extends Document {
    username: string,
    email: string,
    password: string,
    dateOfJoining: number,
    isPaidUser: boolean
}

export { IUser };