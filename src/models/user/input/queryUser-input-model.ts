import {SortDirection} from "mongodb"

export type QueryUserInputModel = {
    searchEmailTerm?: string,
    sortBy?: string,
    sortDirection?: SortDirection,
    pageNumber?: number,
    pageSize?: number,
}

