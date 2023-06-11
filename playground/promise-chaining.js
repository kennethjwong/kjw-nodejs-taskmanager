require("../src/db/mongoose");
const User = require("../src/models/user");

// 6476a76ae5ec99e9ae44c17b

// User.findByIdAndUpdate("6476a76ae5ec99e9ae44c17b", { age: 1 })
//   .then((user) => {
//     console.log(user);
//     return User.countDocuments({ age: 1 });
//   })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age: age });
  const count = await User.countDocuments({ age });
  return count;
};

updateAgeAndCount("6476a76ae5ec99e9ae44c17b", 2)
  .then((count) => {
    console.log(count);
  })
  .catch((e) => {
    console.log(e);
  });
