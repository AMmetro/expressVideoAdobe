import {db} from '../BD/db'

export type NewBlogType = {
    id: number;
    name: string;
    description: string;
    websiteUrl: string;
}
export type UpdatedBlogDataType = {
    name: string;
    description: string;
    websiteUrl: string;
}

export class BlogRepository {
    static getById (id: string){
        const blog = db.blogs.find(v => v.id === +id);
        return blog
    }
    static getAll (){
        return db.blogs
    }
    static create (newBlog:NewBlogType){
         db.blogs.push(newBlog)
        return db.blogs
    }

    static update (updatedBlogId: number, updatedBlogData: UpdatedBlogDataType){
        const blogForUpd = db.blogs.find(b=>b.id === +updatedBlogId)
        if (!blogForUpd){return null}
        const blogAfterUpdate = {...blogForUpd, ...updatedBlogData}
        const updBlogs = db.blogs.map(b => {
        if (b.id === +updatedBlogId) {
            return blogAfterUpdate
        } else {
            return b
        }
      });
        db.blogs = updBlogs
        return blogAfterUpdate
    }

    static delete (deleteBlogId: number){
        const blogForDelete = db.blogs.find(b=>b.id === +deleteBlogId)
        if (!blogForDelete){return null}
        const cleanedBlogs = db.blogs.filter(b=>b.id !== deleteBlogId)
        db.blogs = cleanedBlogs
        return cleanedBlogs
    }


}
