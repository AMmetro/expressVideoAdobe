import { ResultCode } from "../validators/error-validators";

// export function sendCustomResponse(res: any, result: any) {
//   if (result.status === ResultCode.Success) {
//     res.status(204);
//   } else if (result.status === ResultCode.NotFound) {
//     res.status(404).send(`${result.errorMessage}`);
//     return;
//   } else if (result.status === ResultCode.Forbidden) {
//     res.status(403).send(`${result.errorMessage}`);
//     return;
//   } else if (result.status === ResultCode.ServerError) {
//     res.status(503).send(`${result.errorMessage}`);
//     return;
//   }
// }

export function sendCustomError(res: any, result: any) {
  if (result.status === ResultCode.NotFound) {
    res.status(404).send(`${result.errorMessage}`);
    return;
  } else if (result.status === ResultCode.Forbidden) {
    res.status(403).send(`${result.errorMessage}`);
    return;
  } else if (result.status === ResultCode.ServerError) {
    res.status(503).send(`${result.errorMessage}`);
    return;
  }
}
