export type OutputCommentType = {
    id: string,
    content: string;
    commentatorInfo: {
      userId: string;
      userLogin: string;
    };
    createdAt: string;
  };

export type ResultCommentType = {
  status: string,
  errorMessage?: string,
  data?: OutputCommentType | Boolean,
  };