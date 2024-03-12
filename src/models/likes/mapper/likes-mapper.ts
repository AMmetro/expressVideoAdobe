import {WithId} from 'mongodb'
import { LikesDB } from '../db/likes-db'
import { OutputLikesType } from '../output/likes.output'
// import { UserDB } from '../db/likes-db'
// import { OutputUserType } from '../output/user.output'

export const likesMapper = (like:WithId<LikesDB>):OutputLikesType => {
    // @ts-ignore
    return {
        // id: like._id.toString(),
        // commentId: like.commentId,
        // likesCount: like.likesCount,
        // dislikesCount: like.dislikesCount,
        // myStatus: like.myStatus,
        
        id: like._id.toString(),
        commentId: like.commentId,
        // likesCount: like.likesCount,
        // dislikesCount: like.dislikesCount,
        // myStatus: like.myStatus,
    }
}




