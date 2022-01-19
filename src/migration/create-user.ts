import { UserRep } from './../models/index';

console.log("====Create User Table====");

const create_user = async () => {
  await UserRep.sync({ force: true })
    .then(() => {
      console.log("User Table Created Successfullyl!");
    })
    .catch((err) => {
      console.log("User Table Created Error Occurred")
    })
}

create_user();