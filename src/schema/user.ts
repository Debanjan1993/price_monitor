import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types/SchemaTypes';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    dateOfJoining: { type: Number, required: true },
    isPaidUser: { type: Boolean, required: true },
    isVerified: { type: Boolean, required: true },
    links: [{ type: Schema.Types.ObjectId, ref: 'Links' }]
})

const User = mongoose.model<IUser>('User', UserSchema);

export default User;