export type OutputCommentType = {
    id: string,
    content: string;
    commentatorInfo: {
      userId: string;
      userLogin: string;
    };
    // likesInfo: {
    //   likesCount: number;
    //   dislikesCount: number;
    //   myStatus: string;
    //   };
    createdAt: string;
  };


export type ResultCommentType = {
  status: string,
  errorMessage?: string,
  data?: OutputCommentType | Boolean,
  };

  export type likesInfoType = {
    likesCount: number;
    dislikesCount: number;
    }
