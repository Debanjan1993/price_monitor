import { Document, Schema } from 'mongoose';

interface IUser extends Document {
    username: string,
    email: string,
    password: string,
    dateOfJoining: number,
    isPaidUser: boolean,
    links: any;
}

interface ILink extends Document {
    url: string,
    date: string,
    isDisabled: boolean,
}

export { IUser, ILink };