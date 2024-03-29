import { LikesDB, PostLikesDB } from "../db/likes-db";

export type OutputLikesType = {
  commentId: string;
  id: string;
  myStatus: string;
  userId: string;
};

export type OutputPostLikesType = {
  postId: string;
  id: string;
  myStatus: string;
  userId: string;
  addedAt: string;
};

export type likesInfoType = {
  likesCount: number,
  dislikesCount: number,
  myStatus: string,
}

export type ResultLikeType = {
  status: string,
  errorMessage?: string,
  data?: likesInfoType
  };

export type ResultCreateLikeType = {
  status: string,
  errorMessage?: string,
  data?: LikesDB
  };

export type ResultCreatePostLikeType = {
  status: string,
  errorMessage?: string,
  data?: PostLikesDB
  };




