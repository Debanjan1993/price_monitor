import { Document, Schema } from 'mongoose';

interface IUser extends Document {
    username: string,
    email: string,
    password: string,
    dateOfJoining: number,
    isPaidUser: boolean,
    isVerified: boolean,
    links: any;
}

interface ILink extends Document {
    url: string,
    price: number
    date: string,
    isDisabled: boolean,
    isMailSent: boolean
}

export { IUser, ILink };