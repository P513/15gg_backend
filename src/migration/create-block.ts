import { BlockRep } from './../models/index';

console.log("====Create Block Table====");

const create_block = async () => {
  await BlockRep.sync({ force: true })
    .then(() => {
      console.log("Block Table Created Successfullyl!");
    })
    .catch((err) => {
      console.log("Block Table Created Error Occurred" + err)
    })
}

create_block();