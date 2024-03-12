import {WithId} from 'mongodb'
import { LikesDB } from '../db/likes-db'
import { OutputLikesType } from '../output/likes.output'


export const likesMapper = (like:WithId<LikesDB>):OutputLikesType => {
    return {
        id: like._id.toString(),
        commentId: like.commentId,
        myStatus: like.myStatus,
        userId: like.userId,
    }
}





