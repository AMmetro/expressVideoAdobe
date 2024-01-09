import { Router } from "express"
import { authMiddleware } from "../auth/auth-middleware"
import { blogValidation } from "../validators/blog-validators"
import { BlogRepository } from "../repositories/blog-repository"

export const blogRoute = Router({})

blogRoute.get ("/", authMiddleware, blogValidation(), (req: any, res: any) => {
    // res.send(["222233"])
   const xx =  BlogRepository.getAll()
    res.send(xx)
})

blogRoute.get ("/:id", authMiddleware, blogValidation(), (req: any, res: any) => {
    // res.send(["222233"])
   const xx =  BlogRepository.getById(req.params.id)
    res.send(xx)
})