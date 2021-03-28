import { injectable } from "inversify";
import LinksRepository from "../repository/LinksRepository";
import UserRepository from "../repository/UserRepository";
import DIContainer from '../ioc/DIContainer';
import { PollMsgBody } from '../types/Intefaces';
import SQSService from '../SQSService'

@injectable()
class PollingJob {
    private queueName = 'Check_Price'
    private skipCount = 20;
    private takeCount = 20;
    private userRepository: UserRepository;
    private linksRepository: LinksRepository;
    private sqsService: SQSService;
    constructor() {
        this.userRepository = DIContainer.container.get(UserRepository);
        this.linksRepository = DIContainer.container.get(LinksRepository);
        this.sqsService = DIContainer.container.get(SQSService);
    }

    run = async () => {
        console.log(`Db Polling Job Started`);

        const totalUsers = await this.userRepository.getAllUsersCount();
        let linkBody: PollMsgBody[] = [];
        for (let i = 0; i <= totalUsers; i = i + this.skipCount) {
            const users = await this.userRepository.getUsers(i, this.takeCount);
            await Promise.all(users.map(async user => {
                const linksObj: string[] = user.links;
                const links = await this.linksRepository.getLinksByID(linksObj);
                await Promise.all(links.map(async link => {
                    linkBody.push({
                        link: link,
                        userEmail: user.email,
                        username: user.username
                    })
                }))
            }))
        }

        await Promise.all(linkBody.map(async x => {
            await this.sqsService.sendMessage(this.queueName, x, false);
        }))

        console.log('Db Polling Job Ended');

    }


}

export default PollingJob;