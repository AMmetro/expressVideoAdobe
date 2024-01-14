
type BlogsType =
    {
        id: string,
        name: string,
        description: string,
        websiteUrl: string,
    }

type PostsType =
    {
        id: string,
        title: string,
        shortDescription: string,
        content: string,
        blogId: string,
        blogName: string,
    }

    const blogs: BlogsType[] = [
    {
        "id": "1",
        "name": "blogs1111",
        "description": "description1111",
        "websiteUrl": "websiteUrl1111",
    },
    {
        "id": "2",
        "name": "blogs2222",
        "description": "description22222",
        "websiteUrl": "websiteUrl22222",
    }
      ]

     const posts: PostsType[] = [
    {
        "id": "1", 
        "title": "posts111",
        "shortDescription": "shortDescription111",
        "content": "content111",
        "blogId": "1",
        "blogName": "blogs1111",
    }
     ]


export const db = {
    blogs: blogs,
    posts: posts
}
