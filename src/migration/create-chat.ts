import { ChatRep } from './../models/index';

console.log("====Create Chat Table====");

const create_chat = async () => {
  await ChatRep.sync({ force: true })
    .then(() => {
      console.log("Chat Table Created Successfullyl!");
    })
    .catch((err) => {
      console.log("Chat Table Created Error Occurred" + err)
    })
}

create_chat();