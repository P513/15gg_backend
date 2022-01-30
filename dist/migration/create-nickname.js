"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./../models/index");
console.log("====Create Nickname Table====");
const create_nickname = () => __awaiter(void 0, void 0, void 0, function* () {
    yield index_1.NicknameRep.sync({ force: true })
        .then(() => {
        console.log("Nickname Table Created Successfullyl!");
    })
        .catch((err) => {
        console.log("Nickname Table Created Error Occurred" + err);
    });
});
create_nickname();
