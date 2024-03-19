import {WithId} from 'mongodb'
import { OutputPostType } from '../output/post.output'
import { PostDB } from '../db/post-db'

export const postMapper = (post:WithId<PostDB>):OutputPostType => {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
    }
}

