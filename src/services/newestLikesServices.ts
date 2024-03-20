import { UserModel } from "../BD/db";

export class newestLikesServices {

  static async addUserDataToLike(
    newestLikes: any[],
  ): Promise<any[] | null> {

    const enrichedLike = await Promise.all(
      newestLikes.map(async (like) => {
        const user = await UserModel.findOne({ _id: like.userId });
        if (user && user.login) {
          return {
            userId: like.userId,
            addedAt: like.addedAt,
            login: user.login,
          };
        } else {
          return null;
        }
      })
    );

    return enrichedLike

  }

 


  
}
