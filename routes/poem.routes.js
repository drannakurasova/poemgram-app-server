const Poem = require("../models/Poem.model");
const Poet = require("../models/Poet.model");

const router = require("express").Router();

// POST/poem/new-poem to show a form to create a new poem (by admin many and any user)
router.post ("/new-poem", async (req, res, next) => {
    // console.log("all good")
    const { title, text, poet} = req.body;
 
  
    // if (!text || !poet || !title) {
    //   return res
    //     .status(400)
    //     .json({ errorMessage: "Please fill in all the fields" });
    // }
  
    try {
      const foundPoem = await Poem.findOne({ title, poet });
      if (foundPoem !== null) {
        res
          .status(400)
          .json({ errorMessage: "This poem has already been added" });
        return;
      }
     
    } catch (error) {
      console.log(error);
    }
  
    try {
      const newPoem = await Poem.create({
       title,
       text,
       poet 
      })
     const allPoets = await Poet.find().select({firstName, lastName})
      res.json({ allPoets });
    } catch (error) {
      console.log(error);
    }
  });


module.exports = router;
