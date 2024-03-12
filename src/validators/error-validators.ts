import { ErrorMessageType } from './../models/common';
export enum ResultCode {
    Success = "Success",
    NotFound = "NotFound",
    ClientError = "ClientError",
    Forbidden = "Forbidden",
    Unauthorised = "Unauthorised",
    Conflict = "Conflict",
    ServerError = "ServerError",
    ExpectationFailed = "ExpectationFailed",
}

export type Result <T = null> = {
    status: ResultCode;
    errorMessage?: string;
    data?: T;
}

