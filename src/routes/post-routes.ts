import {
  CommentParams,
  RequestWithQuery,
} from "./../models/common";
import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { authMiddleware } from "../auth/basicAuth-middleware";
import { postValidation } from "../validators/post-validators";
import { OutputPostType } from "../models/post/output/post.output";
import {
  Params,
  RequestWithBody,
  RequestWithBodyAndParams,
  RequestWithParams,
  ResposesType,
} from "../models/common";
import {
  RequestInputPostType,
} from "../models/post/input/updateposts-input-model";
import { PostQueryRepository } from "../repositories/post.query-repository";
import { PostServices } from "../services/postServices";
import { QueryPostInputModel } from "../models/blog/input/queryBlog-input-model";
import { basicSortQuery } from "../utils/sortQeryUtils";
import { CommentsQueryRepository } from "../repositories/comments.query-repository";
import { CommentsServices } from "../services/commentsServices";
import { jwtValidationAcssTokenMiddleware, jwtValidationAcssTokenMiddlewareOptional } from "../auth/jwtAuth-middleware";
import { commentValidation } from "../validators/comment-validators";
import { ResultCode } from "../validators/error-validators";
import { sendCustomError } from "../utils/sendResponse";
import { AuthServices } from "../services/authServices";
import { PostLikesModel } from "../BD/db";
import { likeStatusEnum } from "../models/likes/db/likes-db";

export const postRoute = Router({});

class PostsController {

  async createPosts(req: RequestWithBody<RequestInputPostType>, res: Response) {
    const { title, shortDescription, content, blogId } = req.body;
    const newPostModal = {
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId: blogId,
    };
    const newPost = await PostServices.create(newPostModal);
    if (!newPost) {
      res.sendStatus(404);
      return;
    }
    res.status(201).send(newPost);
  }

  async getAllPosts(req: RequestWithQuery<QueryPostInputModel>, res: Response) {
    const userOptionalId = req.user?.id || null;
    const postsRequestsSortData = basicSortQuery(req.query)
    const posts = await PostQueryRepository.getAll(postsRequestsSortData);
    if (!posts) {
      res.status(404);
      return;
    }
    res.status(200).send(posts);
  }

  async getPost(req: RequestWithParams<Params>, res: Response) {
    const postId = req.params.id;
        if (!ObjectId.isValid(postId)) {
          res.sendStatus(404);
          return;
        }
    const userOptionalId = req.user?.id || null;
    const posts = await PostServices.composePost(postId, userOptionalId);
    if (!posts) {
      res.status(404);
      return;
    }
    res.status(200).send(posts);
  }


  async likePost(req: RequestWithParams<Params>, res: Response) {
    const postId = req.params.id;
        if (!postId) {
          res.sendStatus(404);
          return;
        }
    const userId = req.user!.id;
    const likeStatus = req.body.likeStatus;
    if (!likeStatus ||  !likeStatusEnum.hasOwnProperty(likeStatus)) {
      const error = {
        status: ResultCode.ClientError,
        errorMessage: JSON.stringify({
          errorsMessages: [
            {
              message: `Like status is wrong`,
              field: "likeStatus",
            },
          ],
        })
      }
      sendCustomError(res, error)
      return;
    }
    const likes = await PostServices.addLikeToComment(postId, likeStatus, userId);
    if (!likes) {
      res.status(404);
      return;
    }
    res.status(200).send(likes);
  }

}

const postsController = new PostsController()


postRoute.get("/", postsController.getAllPosts );

postRoute.get("/:id",
// jwtValidationAcssTokenMiddlewareOptional,
 postsController.getPost );


postRoute.get(
  "/:postId/comments",
  jwtValidationAcssTokenMiddlewareOptional,
  async (req: RequestWithParams<CommentParams>, res: Response) => {
    const postId = req.params.postId;
    const userOptionalId = req.user?.id || null;
    if (!ObjectId.isValid(postId)) {
      res.sendStatus(404);
      return;
    }
    const postOwner = await PostQueryRepository.getById(postId)
    if (!postOwner) {
      res.sendStatus(404);
      return;
    }
    const basicSortData = basicSortQuery(req.query);

    const result = await PostServices.composePostComments(postId, basicSortData, userOptionalId);
    if (result.status === ResultCode.Success){
      res.status(200).send(result.data);
    } else {
      sendCustomError(res, result)
    }
  }
);


postRoute.post(
  "/",
  authMiddleware,
  postValidation(),
  postsController.createPosts
);

// postRoute.post(
//   "/",
//   authMiddleware,
//   postValidation(),
//   async (req: RequestWithBody<RequestInputPostType>, res: Response) => {
//     const { title, shortDescription, content, blogId } = req.body;
//     const newPostModal = {
//       title: title,
//       shortDescription: shortDescription,
//       content: content,
//       blogId: blogId,
//     };
//     const newPost = await PostServices.create(newPostModal);
//     if (!newPost) {
//       res.sendStatus(404);
//       return;
//     }
//     res.status(201).send(newPost);
//   }
// );

postRoute.post(
  "/:postId/comments",
  jwtValidationAcssTokenMiddleware,
  commentValidation(),
  async (req: RequestWithParams<CommentParams>, res: Response) => {
    const commentedPostId = req.params.postId;
    const userCommentatorId = req.user!.id;
    const content = req.body.content;
    if (!ObjectId.isValid(commentedPostId)) {
      res.sendStatus(404);
      return;
    }
    const result = await CommentsServices.create(commentedPostId, userCommentatorId, content );
    if (result.status === ResultCode.Success){
      res.status(201).send(result.data);
    } else {sendCustomError(res, result)}
  }
);

postRoute.put("/:postId/like-status",
jwtValidationAcssTokenMiddleware,
 postsController.likePost);

postRoute.put(
  "/:id",
  authMiddleware,
  postValidation(),
  async (
    req: RequestWithBodyAndParams<Params, RequestInputPostType>,
    res: Response
  ) => {
    const updatedPostId = req.params.id;
    if (!ObjectId.isValid(updatedPostId)) {
      res.sendStatus(404);
      return;
    }
    const postForUpdated = await PostQueryRepository.getById(updatedPostId);
    if (postForUpdated === null) {
      res.sendStatus(404);
      return;
    }
    const { title, shortDescription, content, blogId } = req.body;
    const updatedPostModal = {
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId: blogId,
    };
    const postIsUpdated = await PostServices.update(
      updatedPostId,
      updatedPostModal
    );
    if (!postIsUpdated) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  }
);

postRoute.delete(
  "/:id",
  authMiddleware,
  async (
    req: RequestWithParams<Params>,
    res: ResposesType<OutputPostType | null>
  ) => {
    const deletePostId = req.params.id;
    if (!ObjectId.isValid(deletePostId)) {
      res.sendStatus(404);
      return;
    }
    const postForDelete = await PostQueryRepository.getById(deletePostId);
    if (!postForDelete) {
      res.sendStatus(404);
      return;
    }
    const isDeletePost = await PostServices.delete(deletePostId);
    // нужно ли перед этм проаерять по айди наличие
    if (!isDeletePost) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  }
);


