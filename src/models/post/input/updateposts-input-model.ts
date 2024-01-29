import { SortDirection } from "mongodb"

export type UpdateInputPostType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
}

export type RequestInputPostType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
}

export type RequestCreatePostFromBlogInputType = Omit<RequestInputPostType, 'blogId'>

export type postsSortDataType = {
    sortBy: string,
    sortDirection: SortDirection,
    pageNumber: number,
    pageSize: number,
  }