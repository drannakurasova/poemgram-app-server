const router = require("express").Router();
const axios = require("axios")
const Poem = require("../models/Poem.model");
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

//GET to show a home page with news from api and random poem and poet
router.get("/poemgram", async (req,res,next)=>{
 try {
  const API_KEY = process.env.NEWS_API_KEY
  const currentNews = await axios.get(`https://newsdata.io/api/1/news?apikey=${API_KEY}&language=en&q=song OR bridal OR moon OR roses OR raven NOT (violence AND murder AND rape AND gun AND torture AND tragic)`)
  // const allPoems = await Poem.find()
  // let relatedPoem={}
  // let keyword = ""
  // const articles=currentNews.data.results
  // articles.forEach (async (article) =>
  // // keyword = article.description.split(" ")
  // relatedPoem = await Poem.findOne ({text: {$in: [JSON.toStringify(article.description.split(" "))]}})  )
  
  console.log(currentNews.data.results);
  res.json(currentNews.data.results)
 } catch (error) {
console.log(error);
 }
})

const authRouter = require ("./auth.routes")
router.use ("/auth", authRouter)

const uploadRoutes = require ("./upload.routes")
router.use ("/upload", uploadRoutes)

const userRouter = require ("./user.routes")
router.use ("/user", userRouter)

const poemRouter = require ("./poem.routes")
router.use ("/poem", poemRouter)

const poetRouter = require ("./poet.routes")
router.use("/poet", poetRouter)

const newsRouter = require ("./news.routes");

router.use ("/news", newsRouter)

module.exports = router;
