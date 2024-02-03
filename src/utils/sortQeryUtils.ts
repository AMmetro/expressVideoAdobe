import {SortDirection} from "mongodb"
      // "express - validator"
      // query("PageNumber").toInt().default(1)

export type QueryType = {
  searchEmailTerm?: string | null, 
  searchNameTerm?: string | null,
  sortBy?: string,
  sortDirection?: SortDirection,
  pageNumber?: number,
  pageSize?: number,
}

export const sortQueryUtils = (query:QueryType) => {
  const result = {
    searchEmailTerm: query.searchEmailTerm ?? null, 
    searchNameTerm: query.searchNameTerm ?? null,
    sortBy: query.sortBy ?? "createdAt",
    sortDirection: query.sortDirection ?? "desc",
    pageNumber: !isNaN(Number(query.pageNumber)) ? Number(query.pageNumber) : 1,
    pageSize: !isNaN(Number(query.pageSize)) ? Number(query.pageSize) : 10,
  };
  return result
}

