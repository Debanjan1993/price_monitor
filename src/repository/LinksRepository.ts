import { injectable } from "inversify";
import Link from "../schema/links";
import User from "../schema/user";
import { ILink } from "../types/SchemaTypes";

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

}

export default LinksRepository;