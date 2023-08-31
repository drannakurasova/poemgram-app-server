const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const isAuthenticated = require("../middlewares/isAuthenticated");
const User = require("../models/User.model");

//POST  /auth /signup    gets data from the form to create a new user
router.post("/signup", async (req, res, next) => {
  const { firstName, lastName, bornIn, photo, email, password } = req.body;
  //   console.log("post signup", req.body);

  if (!firstName || !lastName || !bornIn || !email || !password) {
    return res
      .status(400)
      .json({ errorMessage: "Please fill in all the fields" });
  }

  const regexPassword =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,16}$/gm;
  if (regexPassword.test(password) === false) {
    res.status(400).json({
      errorMessage:
        "Please make sure that your passwords includes at least one capital letter, one lowercase letter, one special character, one number and has between 8 and 16 characters in total",
    });
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    // console.log("password", hashPassword);

    await User.create({
      firstName,
      lastName,
      bornIn,
      email,
      password: hashPassword,
    });

    res.json("accessing");
  } catch (error) {
    console.log(error);
  }
});

//POST  /auth /login   gets data from the form to let or forbid access
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  // console.log(req.body);

  try {
    const foundUser = await User.findOne({ email });
    // console.log("found user", foundUser);

    if (!email || !password) {
      return res
        .status(400)
        .json({ errorMessage: "Please fill in both fields" });
    }

    if (foundUser === null) {
      return res.status(400).json({ errorMessage: "Please check your email" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      foundUser.password
    );
    // console.log("is password correct", isPasswordCorrect);

    if (isPasswordCorrect === false) {
      return res
        .status(400)
        .json({ errorMessage: "Please check your password" });
    }

    const payload = {
      _id: foundUser._id,
      email: foundUser.email,
      role: foundUser.role,
    };

    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "2d",
    });

    res.json({ authToken });
  } catch (error) {
    console.log(error);
  }
});

// GET /auth/verify to let the FE know that the user is active
router.get("/verify", isAuthenticated, (req, res, next) => {
  res.json("token is valid");
});

module.exports = router;