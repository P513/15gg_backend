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

dotenv.config();

const WEB_PORT: number = parseInt(process.env.WEB_PORT as string, 10);
const HOST: string = process.env.NODE_ENV === 'dev' ? process.env.DEV_DB_HOST : process.env.PROD_DB_HOST;
const app = express();
// passport 설정
passportConfig();

if (process.env.NODE_ENV === 'prod') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

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
  },
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`Request Occur! ${req.method}, ${req.url}`);
  next();
})
app.use(passport.initialize());
app.use(passport.session());

// Router
app.use('/auth', auth);
app.use('/myinfo', myinfo);
app.use('/profile', profile);
app.use('/rating', rating);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
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