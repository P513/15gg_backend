import * as dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { auth } from "./routes/auth";
import { myinfo } from "./routes/myinfo";
import { profile } from "./routes/profile";
import { rating } from "./routes/rating";
import { sequelize } from "./models";
import path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

dotenv.config();

const PORT: number = parseInt(process.env.PORT as string, 10);
const HOST: string = process.env.DB_HOST;
const app = express();
// app.set('port', process.env.PORT);

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`Request Occur! ${req.method}, ${req.url}`);
  next();
})

// Router
app.use('/auth', auth);
app.use('/myinfo', myinfo);
app.use('/profile', profile);
app.use('/rating', rating);

app.listen(PORT, HOST, async () => {
  console.log(`Server Listening on ${HOST}:${PORT}`);

  await sequelize.authenticate()
    .then(async () => {
      console.log("Connection Success");
    })
    .catch((e) => {
      console.log("Connection Failed. Reason: ", e);
    })
})