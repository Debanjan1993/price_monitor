import { PollMsgBody, ConfirmationMail } from '../types/Intefaces';
import UserRepository from '../repository/UserRepository';
import LinksRepository from '../repository/LinksRepository';
import DIContainer from '../ioc/DIContainer';
import { transporter } from '../Mail';
import { injectable } from 'inversify';
import config from 'config';
import JobLogger from '../Logger';

@injectable()
class MailJob {
    linksRepository: LinksRepository;
    jobLogger: JobLogger;
    jobName: string = "Mail Job";
    jobNameTemp: string = "Confirmation Mail Job";
    constructor() {
        this.linksRepository = DIContainer.container.get(LinksRepository);
        this.jobLogger = DIContainer.container.get(JobLogger);
    }

    run = async (msgBody: PollMsgBody) => {
        this.jobLogger.info(this.jobName, `Mailing Job to customer started`);

        const linkId = msgBody.link.id;
        const url = msgBody.link.url;
        const email = msgBody.userEmail;
        const name = msgBody.username;
        const link = await this.linksRepository.getLinkByID(linkId);
        if (link.isMailSent) {
            this.jobLogger.warn(this.jobName, `Mail has already been sent to the customer ${msgBody.userEmail} for linkID : ${linkId}`);
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

        this.jobLogger.info(this.jobName, info.messageId);
        this.jobLogger.info(this.jobName, `Mailing job to customer ends`);


    }

    confirmationMail = async (msgBody: ConfirmationMail) => {

        this.jobLogger.info(this.jobNameTemp, `Confirmation Mail Job Started for user ${msgBody.userEmail}`);
        const email = msgBody.userEmail;
        const code = msgBody.code;
        const url = `${config.get<string>("baseUrl")}confirmationMail/${code}`;

        this.jobLogger.info(this.jobNameTemp, `Sending mail to user ${email}`);
        const info = await transporter.sendMail({
            from: '"Price Monitor Private Lmited" <debanjan.dey999@gmail.com>',
            to: email,
            subject: 'Account Confirmation mail',
            text: `Please click on the link below to confirm your email address`,
            html: `<a href="${url}">Link</a>`
        })

        this.jobLogger.info(this.jobNameTemp, info.messageId);
        this.jobLogger.info(this.jobNameTemp, `Ending Confirmation mail job`);

    }
}

export default MailJob;