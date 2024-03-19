import { Router, Request } from "express";
import {
  jwtValidationRefreshTokenMiddleware,
} from "../auth/jwtAuth-middleware";
import { ResultCode } from "../validators/error-validators";
import { sendCustomError } from "../utils/sendResponse";
import { DevicesServices } from "../services/devicesServices";


export const devicesRoute = Router({});

devicesRoute.get(
  "/devices",
  jwtValidationRefreshTokenMiddleware,
  async (req: Request, res: any) => {
    const userId = req.user!.id;
    const result = await DevicesServices.getUsersDevices(userId);
    if (result.status === ResultCode.Success) {
      res.status(200).send(result.data);
    } else {
      sendCustomError(res, result);
    }
  }
);

devicesRoute.delete(
  "/devices/:deviceId",
  jwtValidationRefreshTokenMiddleware,
  async (req: Request, res: any) => {

    // res.sendStatus(300);
    // return;

    const deviceId = req.params.deviceId;
    const userId = req.user!.id;
 
    const result = await DevicesServices.deleteDevicesById(userId, deviceId);
    if (result.status === ResultCode.Success) {
      res.sendStatus(204);
      return;
    } else {
      sendCustomError(res, result);
    }
  }
);

devicesRoute.delete(
  "/devices",
  jwtValidationRefreshTokenMiddleware,
  async (req: Request, res: any) => {
    const userId = req.user!.id;
    const deviceId = req.user!.deviceId;

    const result = await DevicesServices.deleteAllOtherDevices(
      userId,
      deviceId
    );
    if (result.status === ResultCode.Success) {
      res.sendStatus(204);
      return
    } else {
      sendCustomError(res, result);
    }
  }
);
