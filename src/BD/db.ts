import dotenv from 'dotenv';
import { MongoClient } from "mongodb";
import  moongose from 'mongoose';
import { BlogDB } from '../models/blog/db/blog-db';
import { PostDB } from '../models/post/db/post-db'; 

dotenv.config()
const mongoURI = process.env.MONGO_URL; 
if (!mongoURI){
    throw new Error ("No URL for MongoDB conection")
}
export const client = new MongoClient(mongoURI);


const kittySchema = new moongose.Schema({
    name: String
})
export const  KittenModel = moongose.model('Kitten', kittySchema)



const database = client.db("BlogDB")
export const blogsCollection = database.collection<BlogDB>("blogs")
export const postsCollection = database.collection<PostDB>("posts")

export const runDB = async ()=>{
    try {
        // await client.connect()
        await moongose.connect(mongoURI+"/blogDB")
        console.log("DB connected...") 
    } 
    catch(e) {
        console.log(e)
        // await client.close()  
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
