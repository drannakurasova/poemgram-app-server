const User = require("../models/User.model");

const router = require("express").Router();
const isAuthenticated = require("../middlewares/isAuthenticated");

//GET :userId /profile  to see User´s details giving option to edit or delete this user

router.get("/:userId/profile", isAuthenticated, async (req, res, next) => {
  try {
    const foundUser = await User.findById(req.params.userId)
      .populate("likePoem")
      .populate("favouritePoet");

    res.json(foundUser);
  } catch (error) {
    console.log(error);
  }
});

//PUT  /:userId/profile  gets the updated form and sends the new info to the DB
router.put("/:userId/profile", isAuthenticated, async (req, res, next) => {
  try {
    const { firstName, lastName, email } = req.body;
    const userToUpdate = await User.findByIdAndUpdate(req.params.userId, {
      firstName,
      lastName,
      email,
    });

    return res.json(userToUpdate);
  } catch (error) {
    next(error);
  }
});

//PATCH /:userId/profile/edit-image to change the image
router.patch("/:userId/profile", isAuthenticated, async (req, res, next) => {
  try {
    const { image } = req.body;
    const userImageToUpdate = await User.findByIdAndUpdate(req.params.userId, {
      image,
    });

    return res.json(userImageToUpdate);
  } catch (error) {
    next(error);
  }
});

//DELETE  /:userId/profile  to delete the user and navigate to login
router.delete("/:userId/profile", isAuthenticated, async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.json("delted");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
