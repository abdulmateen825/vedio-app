import mongoose from 'mongoose';
import { DB_NAME } from '../constant.js';


const db_connect = async () => {
    try {
        const connectionInstance =await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("connected to database successfully")
        
    } catch (error) {
        console.log("error connecting to database",error)
        process.exit(1)
        
    }


}
export default db_connect;