import express, {Router, Request, Response} from 'express';
import { authMiddleware } from "../auth/auth-middleware"
import { postValidation } from "../validators/post-validators"
import { PostRepository } from "../repositories/post-repository"

export const postRoute = Router({})

postRoute.get ("/", (req: Request, res: Response) => {
    res.send(PostRepository.getAll())
})

postRoute.get ("/:id", (req: any, res: any) => {
   const post =  PostRepository.getById(req.params.id)
   if (!post) {
    res.sendStatus(404)
    return
   }
    res.status(200).send(post)
})

postRoute.post ("/", authMiddleware, postValidation(), (req: Request, res: Response) => {
    const {title, shortDescription, content, blogId } = req.body
    const newPost= {
        title: title,
        shortDescription: shortDescription,
        content: content,
        blogId: blogId 
    }
    const createdPost = PostRepository.create(newPost)
    if (!createdPost){res.sendStatus(400)}
    res.status(201).send(createdPost)
})

postRoute.put ("/:id", authMiddleware, postValidation(), (req: Request, res: Response) => {
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

postRoute.delete ("/:id", authMiddleware, (req: Request, res: Response) => {
    const deletePostId = req.params.id
    const deletePost = PostRepository.delete(deletePostId)
    if (!deletePost){res.sendStatus(404)}
    res.sendStatus(204)
})