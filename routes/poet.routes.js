const router = require("express").Router();
const Poet = require("../models/Poet.model");


//? GET /poets/new-poet to create a new poet (by admin many and one by user)
// POST /poet/new-poet to show a form to create a new poet (by admin many and one by user)
router.post("/new-poet", async (req, res, next) => {
  // console.log("all good")
  const { firstName, lastName, image, bornIn } = req.body;
  console.log("post new poet", req.body);

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
    });

    res.json({ newPoet });
  } catch (error) {
    console.log(error);
  }
});

// GET /poet/all-poets to show all th epoets from the DB
router.get ("/all-poets", async (req, res, next) => {
    try {
     
    const allPoets = await Poet.find().select({ firstName: 1 , lastName: 1, image: 1})
    console.log(allPoets);
    res.json ({allPoets})

    } catch (error) {
        console.log(error);
    }
  
})

module.exports = router;
