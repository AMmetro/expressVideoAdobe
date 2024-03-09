import {Request, Response} from 'express';

export type Params = {id:string};
export type RequestWithParams<P> = Request<P>;
export type RequestWithBody<B> = Request<{}, {}, B>;
export type RequestWithBodyAndParams<P,B> = Request<P, {}, B>;
export type ResposesType<T> = Response<T,{}>;

export const HTTP_RESPONSE_CODE = {
    SUCCESS:200,
    CREATED:201,
}

export type ErrorMessageType = {
    message:string;
    field:string;
}

export type ErrorType = {ErrorMesagess:ErrorMessageType[]}