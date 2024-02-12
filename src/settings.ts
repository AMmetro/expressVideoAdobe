import express from 'express';
import { blogRoute } from './routes/blog-routes';
import { postRoute } from './routes/post-routes';
import { testingRoute } from './routes/testing-routes';
import { usersRoute } from './routes/users-routes';
import { authRoute } from './routes/auth-routes';
import { commentsRoute } from './routes/comments-routes';


export const app = express();

app.use(express.json());

app.use("/auth", authRoute);
app.use("/blogs", blogRoute);
app.use("/posts", postRoute);
app.use("/users", usersRoute);
app.use("/comments", commentsRoute);
app.use("/testing", testingRoute);

