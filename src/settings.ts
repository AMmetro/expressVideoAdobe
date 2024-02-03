import express, {Request, Response} from 'express';
import { blogRoute } from './routes/blog-routes';
import { postRoute } from './routes/post-routes';
import { testingRoute } from './routes/testing-routes';
import { usersRoute } from './routes/users-routes';


export const app = express();

app.use(express.json());

app.use("/blogs", blogRoute);
app.use("/posts", postRoute);
app.use("/users", usersRoute);
app.use("/testing", testingRoute);

