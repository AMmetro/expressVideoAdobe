export type OutputLikesType = {
  commentId: string;
  id: string;
  myStatus: string;
  userId: string;
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


//   export type MapperOutputCommentType = {
//     id: string,
//     content: string;
//     commentatorInfo: {
//       userId: string;
//       userLogin: string;
//     };
//     createdAt: string;
//   };

// export type ResultCommentType = {
//   status: string,
//   errorMessage?: string,
//   data?: OutputCommentType | Boolean,
//   };

//   export type likesInfoType = {
//     likesCount: number;
//     dislikesCount: number;
//     }



