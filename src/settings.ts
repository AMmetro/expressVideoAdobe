import express, {Request, Response} from 'express';
export const app = express();

app.use(express.json());

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

let videos: VideoType[] = [

        {
          "id": 1,
          "title": "video1",
          "author": "author1",
          "canBeDownloaded": true,
          "minAgeRestriction": null,
          "createdAt": "2024-01-02T16:08:37.028Z",
          "publicationDate": "2024-01-02T16:08:37.028Z",
          "availableResolutions": [ "P144" ]
        },
        {
          "id": 2,
          "title": "video2",
          "author": "author2",
          "canBeDownloaded": false,
          "minAgeRestriction": null,
          "createdAt": "2024-01-02T16:08:37.028Z",
          "publicationDate": "2024-01-02T16:08:37.028Z",
          "availableResolutions": [ "P240" ]
        }
]

app.get('/videos', (req: Request, res:Response): void => {
  res.send(videos)
})

type RequestWithBody<B> = Request <unknown, unknown, B, unknown>;
type CreateVideoType = {title: string, author: string, availableResolutions?: typeof AvailableResolutions}
type UpdateVideoType = {
  id: number,
  title: string,
   author: string,
    availableResolutions?: typeof AvailableResolutions,
    canBeDownloaded: boolean,
     minAgeRestriction: number | null,
      publicationDate: string
  }
type ErrorType = {errorsMessages: {message:string, field:string}[]}

type RequestWithParams<P> = Request <P, unknown, unknown, unknown>
type RequestWithBodyUpdate<P,B> = Request <P, unknown, B, unknown>;
type Params= {id:number}

app.get('/videos/:id', (req: RequestWithParams<Params>, res:Response): void => {
    const id: number = +req.params.id;
    const video= videos.find(v => v.id === id); 
    
    if (!video){
        res.sendStatus(404)
        return
    }
    res.send(video)
})

app.post ('/videos', (req:RequestWithBody<CreateVideoType>, res: Response): void => {
    const errors: ErrorType = {errorsMessages: []}

    let {title, author, availableResolutions} = req.body

    if (title === null || !title || typeof title !== "string" || !title.trim() || title.trim().length > 40) {
      errors.errorsMessages.push({message:"Incorect title", field:"title"})
     }

    if (!author || typeof author !== "string" || !author.trim() || author.trim().length > 20) {
      errors.errorsMessages.push({message:"Incorect author", field:"author"})
     }

    if (Array.isArray(availableResolutions)){
      availableResolutions.forEach( (r:string) =>{
            if (!AvailableResolutions.includes(r)){
                errors.errorsMessages.push({message:"incorect available resolutions", field: "availableResolutions"})
               return
            }
    })
} else {availableResolutions= []}

   if (errors.errorsMessages.length){
    res.status(400).send(errors)
    return
   }

   const createdAt = new Date
   const publicationDate = new Date
   publicationDate.setDate(createdAt.getDate() + 1)
   
   const newVideo = {
    id: +(new Date()),
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: createdAt.toISOString(),
    publicationDate: publicationDate.toISOString(),
    title,
    author,
    availableResolutions
   }

   videos.push(newVideo)
   res.status(201).send(newVideo)
}
)


app.put ('/videos/:id', (req:RequestWithBodyUpdate<Params,UpdateVideoType>, res: Response): void => {
  const errors: ErrorType = {errorsMessages: []}

  let {title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate } = req.body
  const id:number = +req.params.id

  let updatedVideoItem = videos.find(v=>v.id === id)

  if (!updatedVideoItem){
    errors.errorsMessages.push({message:"Video not found", field:"videoId"})
    res.status(404).send(errors)
    return
   }

  if ( title===null || !title || typeof title !== "string" || !title.trim() || title.trim().length > 40) {
    errors.errorsMessages.push({message:"Incorect Title", field:"title"})
   } else {updatedVideoItem = {...updatedVideoItem, title:title}}

  if (!author || typeof author !== "string" || !author.trim() || author.trim().length > 20) {
    errors.errorsMessages.push({message:"Incorect author", field:"author"})
   } else {updatedVideoItem = {...updatedVideoItem, author:author}}

  if ((!canBeDownloaded && canBeDownloaded !==false) || typeof canBeDownloaded !== "boolean") {
    errors.errorsMessages.push({message:"Incorect downloaded access", field:"canBeDownloaded"})
   } else {updatedVideoItem = {...updatedVideoItem, canBeDownloaded:canBeDownloaded}}

  if ( minAgeRestriction === null || !isNaN(minAgeRestriction) && minAgeRestriction > 0 && minAgeRestriction < 19 ) {
    updatedVideoItem = {...updatedVideoItem, minAgeRestriction:minAgeRestriction}
   } else {errors.errorsMessages.push({message:"Incorect age restriction access", field:"minAgeRestriction"})}

   const isDate = function(publicationDate:string) {
      const date = Date.parse(publicationDate);
      return !isNaN(date) && publicationDate === new Date(date).toISOString();
}

  if (!isDate(publicationDate)) {
    errors.errorsMessages.push({message:"wrong publication date", field:"publicationDate"})
} else {updatedVideoItem = {...updatedVideoItem, publicationDate:publicationDate}}

  if (Array.isArray(availableResolutions)){
    availableResolutions.forEach( (r:string) =>{
          if (!AvailableResolutions.includes(r)){
              errors.errorsMessages.push({message:"incorect available resolutions", field: "availableResolutions"})
             return  
          }
  })
} 

 if (errors.errorsMessages.length){
  res.status(400).send(errors)
  return
 }

 videos = videos.map(v => {
  if (v.id === id){return {...v, ...updatedVideoItem}} else {return v}
 });

res.sendStatus(204)
// res.status(201).send(updatedVideoItem)
})




app.delete('/videos/:id', (req:Request, res:Response): void => {
  const id = +req.params.id
  const deletedVideoItem = videos.find(v=>v.id === id)


  if (!deletedVideoItem){
    res.sendStatus(404)
    return
  }

  videos = videos.filter(v=>v.id !== id) 

  res.sendStatus(204)
})

app.delete('/testing/all-data', (req:Request, res:Response): void => {videos.length = 0; res.sendStatus(204)})