const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/user");
const auth = require("../middleware/auth");
const { sendWelcomeEmail, sendCancelEmail } = require("../emails/account");
const router = new express.Router();

router.get("/test", (req, res) => {
  res.send("From a new file");
});

// create user
router.post("/users", async (req, res) => {
  //   console.log(req.body);
  const user = new User(req.body);

  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// user login
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    res.status(400).send();
  }
});

// user logout
router.post("/users/logout", auth, async (req, res) => {
  try {
    // console.log(req.user);
    req.user.tokens = req.user.tokens.filter((t) => {
      return t.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

// logout all user instances
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    // console.log(req.user);
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

// show user me
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

// update user
router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    return res.send(req.user);
  } catch (error) {
    res.status(400).send();
  }
});

// delete me
router.delete("/users/me", auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id);
    // if (!user) return res.status(404).send();
    // console.log(req.user.name, req.user.email);
    await req.user.remove();
    sendCancelEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (error) {
    res.status(500).send;
  }
});

// upload pic for avatar
const upload = multer({
  // dest: "images/avatar",
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    // cb(new Error('File must be a PDF'))
    // cb(undefined, true)
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(
        new Error("Please upload a graphic file with (jpg/jpeg/png) extension")
      );
    }
    cb(undefined, true); // accept upload
  },
});

// set avatar
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    // console.log(req.file.buffer);
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();

    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

// remove user me avatar
router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

// show avatar
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) throw new Error();
    res.set("Content-Type", "image/jpg");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send();
  }
});

module.exports = router;
