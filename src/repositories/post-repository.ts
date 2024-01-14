import {db} from '../BD/db'

export type NewPostType = {
    "id": number,
    "title": string,
    "shortDescription": string,
    "content": string,
    "blogId": number,
 }
export type UpdatedPostDataType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: number,
}

export class PostRepository {
    static getAll (){
        return db.posts
    }
    static getById (id: string){
        const post = db.posts.find(v => v.id === +id);
        if (!post){
            return null
        }
        return post
    }
    static create (newPost:NewPostType){
        let appropriateBlogName = db.blogs.find (b => b.id === +newPost?.blogId)?.name
        if (!appropriateBlogName){
            return null
        }
        const equippedPost = {...newPost, blogName: appropriateBlogName}
         db.posts.push(equippedPost)
        return equippedPost
    }

    static update (updatedPostId: number, updatedPostData: UpdatedPostDataType){
        const postForUpd = db.posts.find(p=>p.id === +updatedPostId)
        if (!postForUpd){return null}
        const postAfterUpdate = {...postForUpd, ...updatedPostData}
        const updPosts = db.posts.map(p => {
        if (p.id === +updatedPostId) {
            return postAfterUpdate
        } else {
            return p
        }
      });
        db.posts = updPosts
        return postAfterUpdate
    }

    static delete (deleteBlogId: number){
        const blogForDelete = db.posts.find(b=>b.id === +deleteBlogId)
        if (!blogForDelete){return null}
        const cleanedBlogs = db.posts.filter(b=>b.id !== deleteBlogId)
        db.posts = cleanedBlogs
        return cleanedBlogs
    }


}
