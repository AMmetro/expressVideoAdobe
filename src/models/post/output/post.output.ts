export type OutputPostTypeMapper = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
}

export type OutputPostType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: extendedLikesInfoType
}

export type extendedLikesInfoType = {
    newestLikes: String[],
    likesCount: number,
    dislikesCount: number,
    myStatus:  string,
  }

