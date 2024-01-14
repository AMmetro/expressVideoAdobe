import {db} from '../BD/db'

export type NewPostType = {
    "id": string,
    "title": string,
    "shortDescription": string,
    "content": string,
    "blogId": string,
 }
export type UpdatedPostDataType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
}

export class PostRepository {
    static getAll (){
        return db.posts
    }
    static getById (id: string){
        const post = db.posts.find(p => p.id === id);
        if (!post){
            return null
        }
        return post
    }
    static create (newPost:NewPostType){
        let appropriateBlogName = db.blogs.find (b => b.id === newPost?.blogId)?.name
        if (!appropriateBlogName){
            return null
        }
        const equippedPost = {...newPost, blogName: appropriateBlogName}
         db.posts.push(equippedPost)
        return equippedPost
    }

    static update (updatedPostId: string, updatedPostData: UpdatedPostDataType){
        const postForUpd = db.posts.find(p=>p.id === updatedPostId)
        if (!postForUpd){return null}
        const postAfterUpdate = {...postForUpd, ...updatedPostData}
        const updPosts = db.posts.map(p => {
        if (p.id === updatedPostId) {
            return postAfterUpdate
        } else {
            return p
        }
      });
        db.posts = updPosts
        return postAfterUpdate
    }

    static delete (deletePostId: string){
        const postForDelete = db.posts.find(b=>b.id === deletePostId)
        if (!postForDelete){return null}
        const cleanedPosts = db.posts.filter(b=>b.id !== deletePostId)
        db.posts = cleanedPosts
        return cleanedPosts
    }


}
