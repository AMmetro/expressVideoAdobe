
const AvailableResolutions: string[] = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"]
type VideoType =
    {
        id: number,
        title: string,
        author: string,
        canBeDownloaded: boolean,
        minAgeRestriction: null | number,
        createdAt: string,
        publicationDate: string,
        availableResolutions?: typeof AvailableResolutions
    }

export let videos: VideoType[] = [

    {
        "id": 1,
        "title": "video1",
        "author": "author1",
        "canBeDownloaded": true,
        "minAgeRestriction": null,
        "createdAt": "2024-01-02T16:08:37.028Z",
        "publicationDate": "2024-01-02T16:08:37.028Z",
        "availableResolutions": ["P144"]
    },
    {
        "id": 2,
        "title": "video2",
        "author": "author2",
        "canBeDownloaded": false,
        "minAgeRestriction": null,
        "createdAt": "2024-01-02T16:08:37.028Z",
        "publicationDate": "2024-01-02T16:08:37.028Z",
        "availableResolutions": ["P240"]
    }
]
