import { NicknameRep } from './../models/index';

console.log("====Create Nickname Table====");

const create_nickname = async () => {
  await NicknameRep.sync({ force: true })
    .then(() => {
      console.log("Nickname Table Created Successfullyl!");
    })
    .catch((err) => {
      console.log("Nickname Table Created Error Occurred" + err)
    })
}

create_nickname();