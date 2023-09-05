const Poem = require("../models/Poem.model");
const Poet = require("../models/Poet.model");

const router = require("express").Router();

//GEt /poem/new'poem to show a form and available poets
router.get ("/new-poem", async (req,res, next) => {
    try {
        const allPoets = await Poet.find().select({firstName:1, lastName:1})
        console.log(allPoets);
        res.json (allPoets)
    } catch (error) {
        console.log(error);
    }

})

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
      const newPoem = await Poem.create({
       title,
       text,
       poet
      })
      res.json({ newPoem });
    } catch (error) {
      console.log(error);
    }
  
  });

// GET /poem/all-poems to show all the poems from the DB
router.get ("/all-poems", async (req, res, next) => {
    try {
     
    const allPoems = await Poem.find().select({ title: 1}).populate("poet")
    console.log(allPoems);
    res.json ({allPoems})

    } catch (error) {
        console.log(error);
    }
  
})

// GET /poem/:poemId/details to show one poem´s info
router.get ("/:poemId/details", async (req, res, next) => {
    try {
        const foundPoem = await Poem.findById(req.params.poemId).populate("poet")
 
        console.log(foundPoem);
        res.json([foundPoem])
    } catch (error) {
        console.log(error);
    }

})

//PUT  /:poemId/details  gets the updated form and sends the new info to the DB
router.put("/:poemId/details", async (req, res, next)=> {
    try {

        const {title, text, poet } = req.body
        const poemToUpdate = await Poem.findByIdAndUpdate(req.params.poemId, {
            title, text, poet
        })
        console.log(poemToUpdate);

        return res.json (poemToUpdate)

    } catch (error) {
        next(error);
    }
})

//DELETE  /:poemId/details  to delete the poet and navigate to all poets
router.delete ("/:poemId/details", async (req, res, next) => {
    try {
        await Poem.findByIdAndDelete(req.params.poemId)
        res.json("poem deleted")
    } catch (error) {
        next(error)
    }
})


module.exports = router;
