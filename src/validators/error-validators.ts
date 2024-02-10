import { ErrorMessageType } from './../models/common';
export enum ResultCode {
    Success = "Success",
    NotFound = "NotFound",
    Forbidden = "Forbidden",
}

export type Result <T = null> = {
    status: ResultCode;
    ErrorMessage: string;
    data: T;
}
