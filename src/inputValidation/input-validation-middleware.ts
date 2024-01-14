import { Request, Response, NextFunction} from "express"
import { validationResult, ValidationError } from "express-validator"

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) =>{
    const formattedErrors= validationResult(req).formatWith((error: ValidationError)=>({
        message: error.msg,
        field: error.type==="field" ? error.path : "unknown",
    }))

    if (!formattedErrors.isEmpty()){
        // чтобы не писать bail() в чейне проверок иначе одновременно все ошибки вернуться
        const errorsMessages = formattedErrors.array({ onlyFirstError:true })
        const errorsResponse = {"errorsMessages": errorsMessages}
        res.status(400).send(errorsResponse)
        // return res.status(400).json(errorsResponse)
        return
    }

    return next()

}