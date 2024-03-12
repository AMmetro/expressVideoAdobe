import { WithId, ObjectId } from "mongodb";
import { CommentModel,
  //  LikesModel
   } from "../BD/db";
import { SortDirection } from "mongodb";
import { PaginationType } from "../models/common";
import { UserDB } from "../models/user/db/user-db";
import { AuthUserInputModel } from "../models/user/input/authUser-input-model";
import { CommentDB } from "../models/comments/db/comment-db";
import { commentMapper } from "../models/comments/mapper/comment-mapper";
import { OutputCommentType } from "../models/comments/output/comment.output";
import { OutputBasicSortQueryType } from "../utils/sortQeryUtils";
import { likesMapper } from "../models/likes/mapper/user-mapper";
import { OutputLikesType } from "../models/likes/output/likes.output";
import { LikesDB } from "../models/likes/db/likes-db";



type SortDataType = OutputBasicSortQueryType & { id: string };

export class LikesQueryRepository {
  // static async getPostComments(
  //   sortData: SortDataType
  // ): Promise<PaginationType<OutputCommentType> | null> {

  //   const { 
  //     id,
  //     sortBy,
  //     sortDirection,
  //     pageNumber,
  //     pageSize,
  //   } = sortData;
  //   let filter = { postId: id };
  
  //   try {
  //     const comments: WithId<CommentDB>[] = await CommentModel
  //       .find(filter)
  //       .sort({[sortBy]: sortDirection})
  //       .skip((pageNumber - 1) * pageSize)
  //       .limit(pageSize)
  //       .lean();
  //     const totalCount = await CommentModel.countDocuments(filter);
  //     const pagesCount = Math.ceil(totalCount / pageSize);

  //     return {
  //       pagesCount: pagesCount,
  //       page: pageNumber,
  //       pageSize: pageSize,
  //       totalCount: totalCount,
  //       items: comments.map(commentMapper),
  //     };
  //   } catch (e) {
  //     console.log(e);
  //     return null;
  //   }
  // }

  // static async getById(id: string): Promise<OutputLikesType | null> {
  //   const likes:WithId<LikesDB> | null = await LikesModel.find({ commentId: id }).lean();
  //   if (!likes) {
  //     return null;
  //   }
  //   return likesMapper(likes);
  // }

}
