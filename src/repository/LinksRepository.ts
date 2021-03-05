import { injectable } from "inversify";
import Link from "../schema/links";
import User from "../schema/user";
import { ILink } from "../types/SchemaTypes";
import mongoose, { Schema } from "mongoose";

@injectable()
class LinksRepository {
    constructor() { }

    saveLinkToDB = async (userEmail: string, linkObj: ILink) => {
        const link = new Link(linkObj)
        const savedLink = await link.save();
        const user = await User.findOne({ email: userEmail }).exec();
        user.links.push(link);
        return await user.save();
    }

    getLinksByID = async (ids: string[]) => {
        return await Link.find({
            _id: { "$in": ids }
        })
    }

}

export default LinksRepository;