import { Request, Response, NextFunction} from "express"
import { validationResult, validationError } from "express-validator"

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) =>{
    const formattedErrors= validationResult(req).formatWith((error: validationError)=>({
        message: error.msg,
        field: error.type==="field" ? error.path : "unknown",
    }))

    if (!formattedErrors.isEmpty()){
        // чтобы не писать bail() в чейне проверок иначе одновременно все ошибки вернуться
        const errorsMessages = formattedErrors.array({ onlyFirstError:true })
        res.status(400).send(errorsMessages)
        return
    }

    return next()

}