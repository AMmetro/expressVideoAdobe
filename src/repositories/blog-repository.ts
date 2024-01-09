import {videos} from '../BD/db'

export class BlogRepository {
    static getById (id: string){
        const video = videos.find(v => v.id === +id);
        return video
    }
    static getAll (){
        return videos
    }
}