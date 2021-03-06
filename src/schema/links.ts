import mongoose from "mongoose";
import { ILink } from '../types/SchemaTypes';

const LinkSchema = new mongoose.Schema({
    url: { type: String, required: true },
    price: { type: Number, required: true },
    date: { type: String, required: true },
    isDisabled: { type: Boolean, required: true }
})

const Link = mongoose.model<ILink>('Links', LinkSchema);

export default Link