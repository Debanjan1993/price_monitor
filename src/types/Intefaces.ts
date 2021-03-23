import { ILink } from "./SchemaTypes";

interface PollMsgBody {
    link: ILink,
    userEmail: string,
    username: string
}

export {PollMsgBody};