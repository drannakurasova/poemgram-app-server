const router = require("express").Router();
const Poet = require("../models/Poet.model");
const isAuthenticated = require("../middlewares/isAuthenticated");
const User = require("../models/User.model");
const isAdmin = require("../middlewares/isAdmin");

//? GET /poets/new-poet to create a new poet (by admin many and one by user)
// POST /poet/new-poet to show a form to create a new poet (by admin many and one by user)
router.post("/new-poet", isAuthenticated, async (req, res, next) => {
  try {
    const { firstName, lastName, image, bornIn } = req.body;

    if (!firstName || !lastName || !image || !bornIn) {
      return res
        .status(400)
        .json({ errorMessage: "Please fill in all the fields" });
    }

    if (req.payload.role === "user") {
      const allPoets = await Poet.find().populate("createdBy");
      allPoets.forEach((eachPoet) => {
        if (req.payload._id == eachPoet.createdBy._id) {
          res
            .status(400)
            .json({ errorMessage: "You have already created a poet persona" });
          return;
        }
      });
    }

    const foundPoet = await Poet.findOne({ firstName, lastName });
    if (foundPoet !== null) {
      res.json({ errorMessage: "This poet has already been added" });
      return;
    }
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
      bornIn: 1,
    });

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

    res.json(foundPoet);
  } catch (error) {
    console.log(error);
  }
});

//PUT  /:poetId/details  gets the updated form and sends the new info to the DB
router.put("/:poetId/details", isAuthenticated, async (req, res, next) => {
  try {
    const thisPoet = await Poet.findById(req.params.poetId);
    // console.log(req.payload.role, req.payload._id, thisPoet.createdBy)
    if (req.payload.role === "user" && req.payload._id != thisPoet.createdBy) {
      return res
        .status(401)
        .json({ errorMessage: "You can only edit the poet you´ve added" });
    }

    const { firstName, lastName, image, bornIn } = req.body;
    const poetToUpdate = await Poet.findByIdAndUpdate(req.params.poetId, {
      firstName,
      lastName,
      image,
      bornIn,
    });
    return res.json(poetToUpdate);
  } catch (error) {
    next(error);
  }
});

//PATCH /:poetId/details/edit-image to change the image
router.patch(
  "/:poetId/details",
  isAuthenticated,

  async (req, res, next) => {
    try {
      const { image } = req.body;
      const thisPoet = await Poet.findById(req.params.poetId);
      // console.log(req.payload.role, req.payload._id, thisPoet.createdBy)
      if (
        req.payload.role === "user" &&
        req.payload._id != thisPoet.createdBy
      ) {
        return res
          .status(401)
          .json({ errorMessage: "You can only edit the poet you´ve added" });
      }
      const poetImageToUpdate = await Poet.findByIdAndUpdate(
        req.params.poetId,
        {
          image,
        }
      );

      return res.json(poetImageToUpdate);
    } catch (error) {
      next(error);
    }
  }
);

//PATCH /:poetId/details/add-to-favourite
router.patch(
  "/:poetId/add-to-favourite",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const foundUser = await User.findById(req.payload._id);

      if (foundUser.favouritePoet.includes(req.params.poetId) === true) {
        const poetPulled = await User.findByIdAndUpdate(req.payload._id, {
          $pull: { favouritePoet: req.params.poetId },
        });

        return res.json(poetPulled);
      } else {
        const favouritePoetToUpdate = await User.findByIdAndUpdate(
          req.payload._id,
          {
            $addToSet: { favouritePoet: req.params.poetId },
          }
        );

        return res.json(favouritePoetToUpdate);
      }
    } catch (error) {
      next(error);
    }
  }
);

//DELETE  /:poetId/details  to delete the poet and navigate to all poets
router.delete(
  "/:poetId/details",
  isAuthenticated,
  // isAdmin,
  async (req, res, next) => {
    try {
      if (
        req.payload.role === "user" &&
        req.payload._id != thisPoet.createdBy
      ) {
        return res
          .status(401)
          .json({ errorMessage: "You can only delete the poet you´ve added" });
      }
      await Poet.findByIdAndDelete(req.params.poetId);
      res.json("poet deleted");
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
