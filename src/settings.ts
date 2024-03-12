import express, { NextFunction } from 'express';
import { blogRoute } from './routes/blog-routes';
import { postRoute } from './routes/post-routes';
import { testingRoute } from './routes/testing-routes';
import { usersRoute } from './routes/users-routes';
import { authRoute } from './routes/auth-routes';
import { commentsRoute } from './routes/comments-routes';
import { devicesRoute } from './routes/devices-routes';
import cookieParser from 'cookie-parser';

export const app = express();
// const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());
// app.set('trust proxy', true);

// app.get("/", (_req, res) => {
//    res.send("ok ") 
// });

app.use("/auth", authRoute);
app.use("/blogs", blogRoute);
app.use("/posts", postRoute);
app.use("/security", devicesRoute);
app.use("/users", usersRoute);
app.use("/comments", commentsRoute);
app.use("/testing", testingRoute);


// app.use((error: Error, _req: Request, res: Response, next: NextFunction) => {
//     if (error){
//         console.log(error.message)
//         res.send(error.message)
//     }
//     next();
// });



