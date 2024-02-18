import { WithId, ObjectId } from "mongodb";
import { usersCollection } from "../BD/db";
import { SortDirection } from "mongodb";
import { PaginationType } from "../models/common";
import { UserDB } from "../models/user/db/user-db";
import { userMapper } from "../models/user/mapper/user-mapper";
import { OutputUserType } from "../models/user/output/user.output";
import { searchDataType } from "../models/user/input/queryUser-input-model";
// import { AuthUserFindModel, AuthUserInputModel } from "../models/user/input/authUser-input-model";

type SortDataType = {
  searchEmailTerm?: string | null;
  searchLoginTerm?: string | null;
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};

export class UserQueryRepository {
  static async getAll(
    sortData: SortDataType
  ): Promise<PaginationType<OutputUserType> | null> {
    const {
      searchEmailTerm,
      searchLoginTerm,
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
    } = sortData;

    let filter = {};
    if (searchEmailTerm) {
      filter = {
        email: {
          $regex: searchEmailTerm,
          $options: "i",
        },
      };
    }
    if (searchLoginTerm && !searchEmailTerm) {
      filter = {
        login: {
          $regex: searchLoginTerm,
          $options: "i",
        },
      };
    }
    if (searchLoginTerm && searchEmailTerm) {
      filter = {
        $or: [
          { email: { $regex: searchEmailTerm, $options: "i" } },
          { login: { $regex: searchLoginTerm, $options: "i" } },
        ],
      };
    }
    try {
      const users: WithId<UserDB>[] = await usersCollection
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
        items: users.map(userMapper),
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  static async getById(id: string): Promise<OutputUserType | null> {
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      return null;
    }
    return userMapper(user);
  }

  static async getByConfirmationCode(code: string): Promise<OutputUserType | null> {
    // const user = await usersCollection.findOne({ "emailConfirmation.confirmationCode": code });
    const user = await usersCollection.find({});
    if (!user) {
      return null;
    }
    // return userMapper(user);
    // @ts-ignore
    return user;
  }

  static async getOneByLoginOrEmail(searchData: searchDataType): Promise<WithId<UserDB> | null> {
    const filter = {
      $or: [
        { email: { $regex: searchData.email, $options: "i" } },
        { login: { $regex: searchData.login, $options: "i" } },
      ],
    };
    const user = await usersCollection.findOne(filter);
    if (!user) {
      return null;
    }
    return user;
  }
}
