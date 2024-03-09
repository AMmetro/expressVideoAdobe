export type InputBlogType = {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean,
}

export type UpdateBlogType = {
    name: string,
    description: string,
    websiteUrl: string,
}

export type RequestInputBlogType = {
    name: string,
    description: string,
    websiteUrl: string,
}