import request from 'supertest'
import { app } from '../src/settings'

describe ("should return API data", ()=> {


  // ***************** extra test ****************************
  //   beforeAll(async ()=>{ 
  //       await request(app).delete('/testing/all-data').expect(204)
  //   })

  //   it ('should return 200 and array', async ()=>{
  //     await request(app).get("/videos").
  //     expect(200, [])
  //  })
  // ***************** extra test ****************************


it('- GET product by ID with incorrect id', async () => {
    await request(app).get('/videos/' + 5).expect(404)
})


it ('should return 200 and all videos', async ()=>{
   await request(app).get("/videos").
   expect(200,
    [    
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
  )
})



it ('should return 200 and one videos', async ()=>{
    await request(app).get("/videos/1").
    expect(200,
        {
          "id": 1,
          "title": "video1",
          "author": "author1",
          "canBeDownloaded": true,
          "minAgeRestriction": null,
          "createdAt": "2024-01-02T16:08:37.028Z",
          "publicationDate": "2024-01-02T16:08:37.028Z",
          "availableResolutions": [ "P144" ]
          }
   )
 })


    it('- POST does not create the video with incorrect data (no title, no author)', async function () {
        await request(app)
            .post('/videos/')
            .send({ title: '', author: '' })
            .expect(400, {
                errorsMessages: [
                    { message: 'Incorect title', field: 'title' },
                    { message: 'Incorect author', field: 'author' },
                ],
            })
    })



it ('- PUT the video with correct data', async ()=>{
    await request(app).put("/videos/" + 1)
    .send(        {
      "id": 1,
      "title": "UPDATEDvideo1",
      "author": "author1",
      "canBeDownloaded": true,
      "minAgeRestriction": null,
      "createdAt": "2024-01-02T16:08:37.028Z",
      "publicationDate": "2024-01-02T16:08:37.028Z",
      "availableResolutions": [ "P144" ]
    },)
    .expect(201,
        {
          "id": 1,
          "title": "UPDATEDvideo1",
          "author": "author1",
          "canBeDownloaded": true,
          "minAgeRestriction": null,
          "createdAt": "2024-01-02T16:08:37.028Z",
          "publicationDate": "2024-01-02T16:08:37.028Z",
          "availableResolutions": [ "P144" ]
          }
   )
 })

it ('should return 200 and empty array', async ()=>{
    await request(app).delete("/videos/1").expect(201, [
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
    ])
 })

 it ('- POST video with correct data', async ()=>{


  await request(app).delete('/testing/all-data')

  const createdResponse = await request(app).post("/videos/")
  .send(        {
    "title": "NEWvideo",
    "author": "NEWauthor1",
    "canBeDownloaded": true,
    "minAgeRestriction": null,
    "createdAt": "2024-01-02T16:08:37.028Z",
    "publicationDate": "2024-01-02T16:08:37.028Z",
    "availableResolutions": [ "P144" ]
  },)
  .expect(201)

    const createdVideo = createdResponse.body

    expect (createdVideo).toEqual({
        "id": expect.any(Number),
        "title": "NEWvideo",
        "author": "NEWauthor1",
        "canBeDownloaded": false,
        "minAgeRestriction": null,
        "createdAt": expect.any(String),
        "publicationDate": expect.any(String),
        "availableResolutions": [ "P144" ]
      })

         await request(app).get("/videos").
   expect(200, [createdVideo])
})



}
)
