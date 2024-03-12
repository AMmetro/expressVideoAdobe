import {Request, Response} from 'express';

export type Params = {id:string};
export type CommentParams = {postId:string};
export type RequestWithParams<P> = Request<P>;
export type RequestWithBody<B> = Request<{}, {}, B>;
export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>;
export type RequestWithBodyAndParams<P,B> = Request<P, {}, B>;
export type RequestWithQueryAndParams<P,Q> = Request<P, {}, {}, Q>;
export type ResposesType<T> = Response<T,{}>;

export type ErrorMessageType = {
    message:string;
    field:string;
}

export type ErrorType = {ErrorMesagess:ErrorMessageType[]}

export type PaginationType<I> = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: I[];
}