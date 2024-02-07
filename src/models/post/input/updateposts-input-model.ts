import { SortDirection } from "mongodb";

export type RequestInputBlogPostType = {
  title: string;
  shortDescription: string;
  content: string;
};

export type RequestInputPostType = RequestInputBlogPostType & {
  blogId: string;
};

export type UpdateInputPostType = RequestInputPostType & {
  blogName: string;
  createdAt: string;
};

export type postsSortDataType = {
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};
