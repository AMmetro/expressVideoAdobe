import { WithId } from "mongodb";
import { CommentDB } from "../db/comment-db";
import { OutputCommentType } from "../output/comment.output";

export const commentMapper = (
  comment: WithId<CommentDB>
): OutputCommentType => {
  return {
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: {
      userId: comment.commentatorInfo.userId,
      userLogin: comment.commentatorInfo.userLogin,
    },
    // likesInfo: {
    //   likesCount: comment.likesInfo.likesCount,
    //   dislikesCount: comment.likesInfo.dislikesCount,
    // },
    createdAt: comment.createdAt,
  };
};

