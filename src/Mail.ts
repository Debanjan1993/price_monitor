import nodemailer, { Transporter } from 'nodemailer';
import config from 'config';

let transporter: Transporter = null;
const enableTransporter = async () => {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.get<string>("emailUsername"),
            pass: config.get<string>("emailPassword")
        }
    });
}

export { enableTransporter, transporter };