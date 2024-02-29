import { ObjectId } from "mongodb";
import { postsCollection, securityDevicesCollection } from "../BD/db";
import { RequestInputPostType, UpdateInputPostType } from "../models/post/input/updateposts-input-model";
export class DevicesRepository {

  // static async create(newPostData: UpdateInputPostType) {
  //       const newPostId = await postsCollection.insertOne(newPostData);
  //      return newPostId.insertedId.toString()
  // }

  // static async update(
  //   updatedPostId: string,
  //   updatedPostData: RequestInputPostType
  // ): Promise<Boolean> {

  //   const postForUpd = await postsCollection.updateOne(
  //     { _id: new ObjectId(updatedPostId) },
  //     {$set: {...updatedPostData}}
  //   );
  //   return !!postForUpd.modifiedCount;
  // }

  static async deleteDeviceById(deviceId: string): Promise<Boolean> {
    const deleteDevice = await securityDevicesCollection.deleteOne({deviceId: deviceId});
    return !!deleteDevice.deletedCount;
  }
}
