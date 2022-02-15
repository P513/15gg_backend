"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = require("./routes/auth");
const myinfo_1 = require("./routes/myinfo");
const profile_1 = require("./routes/profile");
const rating_1 = require("./routes/rating");
const models_1 = require("./models");
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const passport_1 = __importDefault(require("passport"));
const passport_2 = require("./config/passport");
const express_session_1 = __importDefault(require("express-session"));
dotenv.config();
const WEB_PORT = parseInt(process.env.WEB_PORT, 10);
const HOST = process.env.NODE_ENV === 'dev' ? process.env.DEV_DB_HOST : process.env.PROD_HOST;
const app = (0, express_1.default)();
// passport 설정
(0, passport_2.passportConfig)();
if (process.env.NODE_ENV === 'prod') {
    app.use((0, morgan_1.default)('combined'));
}
else {
    app.use((0, morgan_1.default)('dev'));
}
// Middleware
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((req, res, next) => {
    console.log(`Request Occur! ${req.method}, ${req.url}`);
    next();
});
// Router
app.use('/auth', auth_1.auth);
app.use('/myinfo', myinfo_1.myinfo);
app.use('/profile', profile_1.profile);
app.use('/rating', rating_1.rating);
passport_1.default.serializeUser(function (user, done) {
    done(null, user);
});
passport_1.default.deserializeUser(function (user, done) {
    done(null, user);
});
app.listen(WEB_PORT, HOST, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server Listening on ${HOST}:${WEB_PORT}`);
    yield models_1.db.authenticate()
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Connection Success");
    }))
        .catch((e) => {
        console.log("Connection Failed. Reason: ", e);
    });
}));
