import { JoinRep } from './../models/index';

console.log("====Create Join Table====");

const create_join = async () => {
  await JoinRep.sync({ force: true })
    .then(() => {
      console.log("Join Table Created Successfullyl!");
    })
    .catch((err) => {
      console.log("Join Table Created Error Occurred" + err)
    })
}

create_join();