import {WithId} from 'mongodb'
import { LikesDB, PostLikesDB } from '../db/likes-db'
import { OutputLikesType, OutputPostLikesType } from '../output/likes.output'


export const commentlikesMapper = (like:WithId<LikesDB>):OutputLikesType => {
    return {
        id: like._id.toString(),
        commentId: like.commentId,
        myStatus: like.myStatus,
        userId: like.userId,
    }
}

export const postLikesMapper = (like:WithId<PostLikesDB>):OutputPostLikesType => {
    return {
        id: like._id.toString(),
        postId: like.postId,
        myStatus: like.myStatus,
        userId: like.userId,
        addetAt: like.addetAt.toISOString(),
    }
}





