import { WithId, ObjectId } from "mongodb";
import { commentsCollection, usersCollection } from "../BD/db";
import { SortDirection } from "mongodb";
import { PaginationType } from "../models/common";
import { UserDB } from "../models/user/db/user-db";
import { userMapper } from "../models/user/mapper/user-mapper";
import { OutputUserType } from "../models/user/output/user.output";
import { AuthUserFindModel, AuthUserInputModel } from "../models/user/input/authUser-input-model";
import { CommentDB } from "../models/comments/db/comment-db";
import { commentMapper } from "../models/comments/mapper/comment-mapper";
import { OutputCommentType } from "../models/comments/output/comment.output";
import { OutputBasicSortQueryType } from "../utils/sortQeryUtils";



type SortDataType = OutputBasicSortQueryType & { id: string };

export class CommentsQueryRepository {
  static async getAll(
    sortData: SortDataType
  ): Promise<PaginationType<OutputCommentType> | null> {
        const {
      id,
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
    } = sortData;
    let filter = { _id: new ObjectId(id) };
    
    try {
      const comments: WithId<CommentDB>[] = await commentsCollection
        .find(filter)
        .sort(sortBy, sortDirection)
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .toArray();
      const totalCount = await usersCollection.countDocuments(filter);
      const pagesCount = Math.ceil(totalCount / pageSize);

      return {
        pagesCount: pagesCount,
        page: pageNumber,
        pageSize: pageSize,
        totalCount: totalCount,
        items: comments.map(commentMapper),
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  static async getById(id: string): Promise<OutputCommentType | null> {
    const comment:WithId<CommentDB> | null = await commentsCollection.findOne({ _id: new ObjectId(id) });
    if (!comment) {
      return null;
    }
    return commentMapper(comment);
  }

  static async getOneForAuth(
    authUserModel: AuthUserFindModel
  ): Promise<WithId<UserDB> | null> {
    const { loginOrEmail } = authUserModel;
    const filter = {
      $or: [
        { email: { $regex: loginOrEmail, $options: "i" } },
        { login: { $regex: loginOrEmail, $options: "i" } },
      ],
    };
    const user = await usersCollection.findOne(filter);
    if (!user) {
      return null;
    }
    return user;
  }
}