import { PollMsgBody, ConfirmationMail } from '../types/Intefaces';
import UserRepository from '../repository/UserRepository';
import LinksRepository from '../repository/LinksRepository';
import DIContainer from '../ioc/DIContainer';
import { transporter } from '../Mail';
import { injectable } from 'inversify';
import config from 'config';

@injectable()
class MailJob {
    linksRepository: LinksRepository;
    constructor() {
        this.linksRepository = DIContainer.container.get(LinksRepository);
    }

    run = async (msgBody: PollMsgBody) => {
        console.log(`Mailing Job to customer started`);

        const linkId = msgBody.link.id;
        const url = msgBody.link.url;
        const email = msgBody.userEmail;
        const name = msgBody.username;
        const link = await this.linksRepository.getLinkByID(linkId);
        if (link.isMailSent) {
            console.log(`Mail has already been sent to the customer ${msgBody.userEmail} for linkID : ${linkId}`);
            return;
        }

        const info = await transporter.sendMail({
            from: '"Price Monitor Private Lmited" <debanjan.dey999@gmail.com>',
            to: email,
            subject: 'Decrease in price',
            text: `There has been a price decrease for the product ${url}`,
            html: `<a href="${url}">Link</a>`
        })

        if (info.messageId) {
            link.isMailSent = true;
            await this.linksRepository.updateLinkById(linkId, link)
        }

        console.log(info.messageId);
        console.log(`Mailing job to customer ends`);


    }

    confirmationMail = async (msgBody: ConfirmationMail) => {
        
        console.log(`Confirmation Mail Job Started for user ${msgBody.userEmail}`);
        const email = msgBody.userEmail;
        const code = msgBody.code;
        const url = `${config.get<string>("baseUrl")}confirmationMail/${code}`;

        console.log(`Sending mail to user ${email}`);
        const info = await transporter.sendMail({
            from: '"Price Monitor Private Lmited" <debanjan.dey999@gmail.com>',
            to: email,
            subject: 'Account Confirmation mail',
            text: `Please click on the link below to confirm your email address`,
            html: `<a href="${url}">Link</a>`
        })

        console.log(info.messageId);
        console.log(`Ending Confirmation mail job`);

    }
}

export default MailJob;