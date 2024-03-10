import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { WithId } from 'mongodb'
import  mongoose  from 'mongoose';
import { BlogDB, BlogDBSchema } from '../models/blog/db/blog-db';
import { PostDB } from '../models/post/db/post-db';  
import { UserDB, 
    UserSchema
 } from '../models/user/db/user-db';
import { CommentDB } from '../models/comments/db/comment-db';
import { appConfig } from '../appConfig';
import { SecurityDevicesDB } from '../models/devices/db/devices-db';
import { RateLimitDB, RateLimitSchema } from '../models/rateLimit/db/rateLimit-db';

dotenv.config()
const mongoURI = appConfig.mongoURI; 
if (!mongoURI){
    throw new Error ("No URL for MongoDB conection")
}

export const client = new MongoClient(mongoURI);

const database = client.db("BlogDB")
export const usersCollection = database.collection<UserDB>("users")
export const securityDevicesCollection = database.collection<SecurityDevicesDB>("devices")
export const blogsCollection = database.collection<BlogDB>("blogs")
export const postsCollection = database.collection<PostDB>("posts")
export const commentsCollection = database.collection<CommentDB>("comments")
// export const rateLimitCollection = database.collection<RateLimitDB>("ratelimit")


// const kittySchema = new mongoose.Schema({name: String})
// export const  KittenModel = mongoose.model('Kitten', kittySchema)

// export const UserModel = mongoose.model<WithId<UserDB>>('users', UserSchema)
export const RateLimitModel = mongoose.model<WithId<RateLimitDB>>("ratelimit", RateLimitSchema)
// export const BlogModel = mongoose.model<WithId<BlogDB>>("blogs", BlogDBSchema)


export const runDB = async ()=>{
    try {
        // await client.connect()
        await mongoose.connect("mongodb+srv://metroexpress:suradet842@cluster0.gkpqpve.mongodb.net"+"/BlogDB");
        console.log("DB connected...") 
        // await BlogModel.deleteMany({});
    } 
    catch(e) {
        console.log(e)
        // await client.close()  
        await mongoose.disconnect();
    }
} 


