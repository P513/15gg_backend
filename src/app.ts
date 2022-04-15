import * as dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { auth } from "./routes/auth";
import { myinfo } from "./routes/myinfo";
import { profile } from "./routes/profile";
import { rating } from "./routes/rating";
import { db } from "./models";
import path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import passport from 'passport';
import { passportConfig } from './config/passport';
import session from 'express-session';
import User from "./models/user";

dotenv.config();

const WEB_PORT: number = parseInt(process.env.WEB_PORT as string, 10);
const HOST: string = process.env.NODE_ENV === 'dev' ? process.env.DEV_DB_HOST : process.env.PROD_HOST;
const app = express();
// passport 설정
passportConfig();

if (process.env.NODE_ENV === 'prod') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// app.use((req: Request, res: Response, next: NextFunction) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'content-type, x-access-token');
//   res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
//   // res.setHeader('Access-Control-Allow-Origin', process.env.SERVER);
//   // res.setHeader('Access-Control-Allow-Method', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//   // res.setHeader('Access-Control-Allow-Credentials', 1);
//   next();
// });
// Middleware
app.use(cors());
app.use(cookieParser());
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60,
  },
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`Request Occur! ${req.method}, ${req.url}`);
  next();
});

// Router
app.use('/auth', auth);
app.use('/myinfo', myinfo);
app.use('/profile', profile);
app.use('/rating', rating);

passport.serializeUser(function (user: any, done: any) {
  done(null, user);
});

passport.deserializeUser(function (req: Request, user: User, done: any) {
  done(null, user);
});

app.listen(WEB_PORT, HOST, async () => {
  console.log(`Server Listening on ${HOST}:${WEB_PORT}`);

  await db.authenticate()
    .then(async () => {
      console.log("Connection Success");
    })
    .catch((e) => {
      console.log("Connection Failed. Reason: ", e);
    })
});