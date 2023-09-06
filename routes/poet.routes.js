const router = require("express").Router();
const Poet = require("../models/Poet.model");
const isAuthenticated = require("../middlewares/isAuthenticated");
const User = require("../models/User.model");

//? GET /poets/new-poet to create a new poet (by admin many and one by user)
// POST /poet/new-poet to show a form to create a new poet (by admin many and one by user)
router.post("/new-poet", isAuthenticated, async (req, res, next) => {
  // console.log("all good")
  const { firstName, lastName, image, bornIn } = req.body;
  console.log("post new poet", req.body);
  console.log("payload", req.payload);

  if (!firstName || !lastName || !image || !bornIn) {
    return res
      .status(400)
      .json({ errorMessage: "Please fill in all the fields" });
  }

  try {
    const foundPoet = await Poet.findOne({ firstName, lastName });
    if (foundPoet !== null) {
      res
        .status(400)
        .json({ errorMessage: "This poet has already been added" });
      return;
    }
  } catch (error) {
    console.log(error);
  }

  try {
    const newPoet = await Poet.create({
      firstName,
      lastName,
      image,
      bornIn,
      createdBy: req.payload._id,
    });

    res.json({ newPoet });
  } catch (error) {
    console.log(error);
  }
});

// GET /poet/all-poets to show all th epoets from the DB
router.get("/all-poets", isAuthenticated, async (req, res, next) => {
  try {
    const allPoets = await Poet.find().select({
      firstName: 1,
      lastName: 1,
      image: 1,
    });
    console.log(allPoets);
    res.json({ allPoets });
  } catch (error) {
    console.log(error);
  }
});

// GET /poet/:poetId/details to show one poet´s info
router.get("/:poetId/details", isAuthenticated, async (req, res, next) => {
  try {
    const foundPoet = await Poet.findById(req.params.poetId).populate(
      "createdBy"
    );
    // const foundUser = await User.findById(foundPoet.createdBy)
    console.log(foundPoet);
    res.json([foundPoet]);
  } catch (error) {
    console.log(error);
  }
});

//PUT  /:poetId/details  gets the updated form and sends the new info to the DB
router.put("/:poetId/details", isAuthenticated, async (req, res, next) => {
  try {
    const { firstName, lastName, image, bornIn } = req.body;
    const poetToUpdate = await Poet.findByIdAndUpdate(req.params.poetId, {
      firstName,
      lastName,
      image,
      bornIn,
    });
    console.log(poetToUpdate);

    return res.json(poetToUpdate);
  } catch (error) {
    next(error);
  }
});

//PATCH /:poetId/details/edit-image to change the image
router.patch("/:poetId/details", isAuthenticated, async (req, res, next) => {
  try {
    const { image } = req.body;
    const poetImageToUpdate = await Poet.findByIdAndUpdate(req.params.poetId, {
      image,
    });

    return res.json(poetImageToUpdate);
  } catch (error) {
    next(error);
  }
});

//PATCH /:poetId/details/add-to-favourite
router.patch(
  "/:poetId/add-to-favourite",
  isAuthenticated,
  async (req, res, next) => {
    try {
      // const {addToFavouritePoet} =req.body
      const foundUser = await User.findById(req.payload._id);

      if (foundUser.favouritePoet.includes(req.params.poetId) === true) {
        const poetPulled = await User.findByIdAndUpdate(req.payload._id, {
          $pull: { favouritePoet: req.params.poetId },
        });
        console.log("pulled");
        return res.json (poetPulled)
      } else { 

      const favouritePoetToUpdate = await User.findByIdAndUpdate(
        req.payload._id,
        {
          $addToSet: { favouritePoet: req.params.poetId },
        }
      );
      console.log("added");
      return res.json(favouritePoetToUpdate);
    }

      
    } catch (error) {
      next(error);
    }
  }
);

//DELETE  /:poetId/details  to delete the poet and navigate to all poets
router.delete("/:poetId/details", isAuthenticated, async (req, res, next) => {
  try {
    await Poet.findByIdAndDelete(req.params.poetId);
    res.json("poet deleted");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
