import express, {Router, Request, Response} from 'express';
import { authMiddleware } from "../auth/auth-middleware"
import { blogValidation } from "../validators/blog-validators"
import { BlogRepository } from "../repositories/blog-repository"

export const blogRoute = Router({})

blogRoute.get ("/", (req: Request, res: Response) => {
    res.status(200).send(BlogRepository.getAll())
})

blogRoute.get ("/:id", (req: any, res: any) => {
   const blog =  BlogRepository.getById(req.params.id)
   if (!blog) {
    res.sendStatus(404)
    // return
   }
    res.status(200).send(blog)
})

blogRoute.post ("/", authMiddleware, blogValidation(), (req: Request, res: Response) => {
    const {name, description, websiteUrl } = req.body
    const newBlog= {
        id: String(+(new Date())),
        name: name,
        description: description,
        websiteUrl: websiteUrl,
    }
    const createdBlog = BlogRepository.create(newBlog)
    res.status(201).send(createdBlog)
})

blogRoute.put ("/:id", authMiddleware, blogValidation(), (req: Request, res: Response) => {
    const updatedBlogId = req.params.id
    const {name, description, websiteUrl } = req.body
    const updatedBlogData= {
        name: name,
        description: description,
        websiteUrl: websiteUrl,
    }
    const createdBlog = BlogRepository.update(updatedBlogId, updatedBlogData)
    if (!createdBlog){res.sendStatus(404)}
    res.sendStatus(204)
})

blogRoute.delete ("/:id", authMiddleware, blogValidation(), (req: Request, res: Response) => {
    const deleteBlogId = req.params.id
    const deleteBlog = BlogRepository.delete(deleteBlogId)
    if (!deleteBlog){res.sendStatus(404)}
    res.sendStatus(204)
})