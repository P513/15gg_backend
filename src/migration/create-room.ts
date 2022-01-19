import { RoomRep } from './../models/index';

console.log("====Create Room Table====");

const create_room = async () => {
  await RoomRep.sync({ force: true })
    .then(() => {
      console.log("Room Table Created Successfullyl!");
    })
    .catch((err) => {
      console.log("Room Table Created Error Occurred")
    })
}

create_room();