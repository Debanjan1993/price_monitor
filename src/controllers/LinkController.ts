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

        const { url, price } = req.body;

        if (!url || !validUrl.isUri(url)) {
            return res.status(401).json('Enter valid Url');
        }

        if (!price) {
            return res.status(401).json('Please enter the price');
        }

        let dbObj: Partial<ILink> = {
            url: url,
            price: price,
            date: moment().format("DD-MM-YYYY"),
            isDisabled: false
        }

        await this.linksRepository.saveLinkToDB(req.session.email, dbObj as ILink)

        return res.status(201).json('Link Added');

    }

    deleteLink = async (req: Request, res: Response) => {

        const { link } = req.body;
        if (!link) {
            return res.status(401).json('No URL in the param');
        }

        await this.linksRepository.deleteLinkByURL(link);

        return res.status(200).json('Link Deleted');

    }

}

export default LinkController;