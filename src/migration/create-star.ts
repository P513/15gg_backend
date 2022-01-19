import { StarRep } from './../models/index';

console.log("====Create Star Table====");

const create_star = async () => {
  await StarRep.sync({ force: true })
    .then(() => {
      console.log("Star Table Created Successfullyl!");
    })
    .catch((err) => {
      console.log("Star Table Created Error Occurred")
    })
}

create_star();