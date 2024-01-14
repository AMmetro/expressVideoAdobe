import express, {Router, Request, Response} from 'express';
import { authMiddleware } from "../auth/auth-middleware"
import { blogValidation } from "../validators/blog-validators"
import { PostRepository } from "../repositories/post-repository"

export const postRoute = Router({})

postRoute.get ("/", (req: Request, res: Response) => {
    res.send(PostRepository.getAll())
})

postRoute.get ("/:id", authMiddleware, blogValidation(), (req: any, res: any) => {
   const post =  PostRepository.getById(req.params.id)
   if (!post) {
    res.sendStatus(404)
    return
   }
    res.status(200).send(post)
})

postRoute.post ("/", authMiddleware, blogValidation(), (req: Request, res: Response) => {
    const {title, shortDescription, content, blogId } = req.body
    const newPost= {
        id: String(+(new Date())),
        title: title,
        shortDescription: shortDescription,
        content: content,
        blogId: blogId 
    }
    const createdPost = PostRepository.create(newPost)
    if (!createdPost){res.sendStatus(400)}
    res.status(201).send(createdPost)
})

postRoute.put ("/:id", authMiddleware, blogValidation(), (req: Request, res: Response) => {
    const updatedPostId = req.params.id
    const {title, shortDescription, content, blogId } = req.body
    const updatedPostData= {
        title: title,
        shortDescription: shortDescription,
        content: content,
        blogId: blogId,
    }
    const createdPost = PostRepository.update(updatedPostId, updatedPostData)
    if (!createdPost){res.sendStatus(404)}
    res.sendStatus(204)
})

postRoute.delete ("/:id", authMiddleware, blogValidation(), (req: Request, res: Response) => {
    const deletePostId = req.params.id
    const deletePost = PostRepository.delete(deletePostId)
    if (!deletePostId){res.sendStatus(404)}
    res.sendStatus(204)
})