import dotenv from 'dotenv';
import { MongoClient } from "mongodb";
import { BlogDB } from '../models/blog/db/blog-db';
import { PostDB } from '../models/post/db/post-db';  
import { UserDB } from '../models/user/db/user-db';
import { CommentDB } from '../models/comments/db/comment-db';
import { appConfig } from '../appConfig';
import { SecurityDevicesDB } from '../models/devices/db/devices-db';

// dotenv.config()
// const mongoURI = process.env.MONGO_URL || "mongodb://0.0.0.0:27017"; 
// const mongoURI = process.env.MONGO_URL; 
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

export const runDB = async ()=>{
    try {
        await client.connect()
        console.log("DB connected...") 
    } 
    catch(e) {
        console.log(e)
        await client.close()  
    }
} 



type BlogsType =
    {
        id: string,
        name: string,
        description: string,
        websiteUrl: string,
    }

type PostsType =
    {
        id: string,
        title: string,
        shortDescription: string,
        content: string,
        blogId: string,
        blogName: string,
    }

    const blogs: BlogsType[] = [
    {
        "id": "1",
        "name": "blogs1111",
        "description": "description1111",
        "websiteUrl": "websiteUrl1111",
    },
    {
        "id": "2",
        "name": "blogs2222",
        "description": "description22222",
        "websiteUrl": "websiteUrl22222",
    }
      ]

     const posts: PostsType[] = [
    {
        "id": "1", 
        "title": "posts111",
        "shortDescription": "shortDescription111",
        "content": "content111",
        "blogId": "1",
        "blogName": "blogs1111",
    }
     ]


export const db = {
    blogs: blogs,
    posts: posts
}
