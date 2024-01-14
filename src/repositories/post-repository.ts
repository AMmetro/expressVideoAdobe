import {db} from '../BD/db'

export type NewPostType = {
    "id": number,
    "title": string,
    "shortDescription": string,
    "content": string,
    "blogId": number,
 }
export type UpdatedBlogDataType = {
    name: string;
    description: string;
    websiteUrl: string;
}

export class PostRepository {
    static getAll (){
        return db.posts
    }
    static getById (id: string){
        const post = db.posts.find(v => v.id === +id);
        if (!post){return null}
        // const appropriateBlogName = db.blogs.find (b => b.id === +post?.blogId)?.name
        return post
    }
    static create (newPost:NewPostType){
        let appropriateBlogName = db.blogs.find (b => b.id === +newPost?.blogId)?.name
        if (!appropriateBlogName){
            appropriateBlogName="no blog Name"
        }
        const equippedPost = {...newPost, blogName: appropriateBlogName}
         db.posts.push(equippedPost)
        return db.posts
    }

    static update (updatedBlogId: number, updatedBlogData: UpdatedBlogDataType){
        const blogForUpd = db.posts.find(b=>b.id === +updatedBlogId)
        if (!blogForUpd){return null}
        const blogAfterUpdate = {...blogForUpd, ...updatedBlogData}
        const updBlogs = db.posts.map(b => {
        if (b.id === +updatedBlogId) {
            return blogAfterUpdate
        } else {
            return b
        }
      });
        db.posts = updBlogs
        return blogAfterUpdate
    }

    static delete (deleteBlogId: number){
        const blogForDelete = db.posts.find(b=>b.id === +deleteBlogId)
        if (!blogForDelete){return null}
        const cleanedBlogs = db.posts.filter(b=>b.id !== deleteBlogId)
        db.posts = cleanedBlogs
        return cleanedBlogs
    }


}
