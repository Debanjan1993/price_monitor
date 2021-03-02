import { injectable } from "inversify";
import DIContainer from "../ioc/DIContainer";
import LinksRepository from "../repository/LinksRepository";
import { Request, Response } from 'express';
import validUrl from 'valid-url';
import { ILink } from "../types/SchemaTypes";
import moment from 'moment';
import session from "express-session";

@injectable()
class LinkController {
    linksRepository: LinksRepository;
    constructor() {
        this.linksRepository = DIContainer.container.get(LinksRepository);
    }

    createLink = async (req: Request, res: Response) => {

        const { url } = req.body;

        if (!url || !validUrl.isUri(url)) {
            res.status(401).json('Enter valid Url');
        }

        let dbObj: Partial<ILink> = {
            url: url,
            date: moment().format("DD-MM-YYYY"),
            isDisabled: false
        }

        await this.linksRepository.saveLinkToDB(req.session.email, dbObj as ILink)

        return res.status(201).json('Link Added');

    }

}

export default LinkController;