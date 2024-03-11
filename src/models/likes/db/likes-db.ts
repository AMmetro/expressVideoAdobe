import mongoose from 'mongoose'
import { WithId } from 'mongodb'

export type LikesDB = {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
};

// type emailConfirmationType = {
//   confirmationCode: string;
//   expirationDate: any;
//   isConfirmed: boolean;
// };

// export const BlackListTokenSchema = new mongoose.Schema<blackListTokenType>() // wrong!!

// export const EmailConfirmationsChema = new mongoose.Schema<emailConfirmationType>({
//   confirmationCode: { type: String, require: true },
//   expirationDate: { type: String, require: true },
//   isConfirmed: { type: Boolean, require: true },
// })

export const LikesSchema = new mongoose.Schema<WithId<LikesDB>>({
  likesCount: { type: Number, require: true },
  dislikesCount: { type: Number, require: true },
  myStatus: { type: String, require: true },
})




//         // {
//         //   "id": "string",
//         //   "content": "string",
//         //   "commentatorInfo": {
//         //     "userId": "string",
//         //     "userLogin": "string"
//         //   },
//         //   "createdAt": "2024-03-11T04:41:44.836Z",
//         //   "likesInfo": {
          
//         coment{
//           link: likeId
//           countLikes:
//         }
        
//           userId: кто поставил userId
//         //     "likesCount": 50,
//         //     "dislikesCount": 10,
//         //     "myStatus": "None"
//         я ставил like/dislake или нет None
//         //   }
//         // }
// =========================1 var  каждый рах увел/ уменьш=================================
//         coment{
//           countLikes: 90
//           countDislikes: 40
//         }
// =========================2 var  ========================= 
//         1 - достаем все лайки по комент айди 
//         2 - в цикле мстаем лайки и дизлайки 
//         3 - добвляем оба числа во вью можель             
//           userId: кто поставил userId
//         //     "likesCount": 50,
//         //     "dislikesCount": 10,
//         //     "myStatus": "None"
//         я ставил like/dislake или нет None
//         //   }
//         // }

