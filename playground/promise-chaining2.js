require("../src/db/mongoose");
const Task = require("../src/models/task");

// 647698c2a3a81ae2b65fe631

// Task.findByIdAndDelete("647698c2a3a81ae2b65fe631")
//   .then((task) => {
//     console.log(task);
//     return Task.countDocuments({ completed: false });
//   })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

const deleteTaskAndCount = async (id) => {
  const task = await Task.findByIdAndDelete(id);
  const count = await Task.countDocuments({ completed: false });
  return count;
};

deleteTaskAndCount("6476999ba01dfee33b80f7cf")
  .then((count) => {
    console.log(count);
  })
  .catch((e) => {
    console.log(e);
  });
