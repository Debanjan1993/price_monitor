import mongoose, { CallbackError } from 'mongoose';
import config from 'config';


const connectToDB = async () => {

    const uri: string = config.get<string>("mongoUri");
    const db = mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => console.log(`Connected to MongoDB successfully`))
        .catch(err => console.log(err))

}

export default connectToDB;