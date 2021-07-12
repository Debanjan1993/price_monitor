import { ILink } from "./SchemaTypes";

interface PollMsgBody {
    link: ILink,
    userEmail: string,
    username: string
}

interface ConfirmationMail {
    userEmail: string,
    code: string
}

export { PollMsgBody, ConfirmationMail };