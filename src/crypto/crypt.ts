import bcrypt from 'bcrypt';
import { injectable } from 'inversify';

@injectable()
class Crypt {
    private saltRounds: 10;
    constructor() { }

    createCrypt = async (password: string): Promise<string> => {
        const salt = await bcrypt.genSalt(this.saltRounds);
        const hashpassword = await bcrypt.hash(password, salt);
        return hashpassword
    }

    comparePassword = async (userPassword: string, hashedPassword: string): Promise<boolean> => {
        const isValid = await bcrypt.compare(userPassword, hashedPassword);
        return isValid;
    }
}

export default Crypt;