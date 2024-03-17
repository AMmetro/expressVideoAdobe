import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { WithId } from 'mongodb'
import  mongoose  from 'mongoose';
import { BlogDB, BlogDBSchema } from '../models/blog/db/blog-db';
import { PostDB, PostSchema } from '../models/post/db/post-db';  
import { UserDB, 
    UserSchema
 } from '../models/user/db/user-db';
import { CommentDB, CommentSchema } from '../models/comments/db/comment-db';
import { appConfig } from '../appConfig';
import { SecurityDevicesDB, SecurityDevicesSchema } from '../models/devices/db/devices-db';
import { RateLimitDB, RateLimitSchema } from '../models/rateLimit/db/rateLimit-db';
import { LikesDB, LikesSchema } from '../models/likes/db/likes-db';

dotenv.config()
const mongoURI = appConfig.mongoURI; 
if (!mongoURI){
    throw new Error ("No URL for MongoDB conection")
}

export const UserModel = mongoose.model<WithId<UserDB>>('users', UserSchema)
export const CommentLikesModel = mongoose.model<WithId<LikesDB>>('commentLikes', LikesSchema)
export const RateLimitModel = mongoose.model<WithId<RateLimitDB>>("ratelimit", RateLimitSchema)
export const BlogModel = mongoose.model<WithId<BlogDB>>("blogs", BlogDBSchema)
export const PostModel = mongoose.model<WithId<PostDB>>("posts", PostSchema)
export const CommentModel = mongoose.model<WithId<CommentDB>>("comments", CommentSchema)
export const SecurityDevicesModel = mongoose.model<WithId<SecurityDevicesDB>>("devices", SecurityDevicesSchema)


export const runDB = async ()=>{
    try {
        await mongoose.connect("mongodb+srv://metroexpress:suradet842@cluster0.gkpqpve.mongodb.net"+"/BlogDB");
        console.log("DB connected...") 
    } 
    catch(e) {
        console.log(e)
        await mongoose.disconnect();
    }
} 


