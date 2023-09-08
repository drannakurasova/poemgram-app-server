const router = require("express").Router();
const axios = require("axios");
const Poem = require("../models/Poem.model");
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

//GET to show a home page with news from api and random poem and poet
router.get("/poemgram", async (req, res, next) => {
  try {
    const API_KEY = process.env.NEWS_API_KEY;
    const currentNews = await axios.get(
      `https://newsdata.io/api/1/news?apikey=${API_KEY}&language=en&category=sports,technology,politics,science,top&q=father OR anger OR love OR game OR tender OR welcome OR name OR reputation OR men OR summer OR physicians OR mad OR thunder OR heart OR Moscow OR women OR railway OR moon OR sleeping OR treasure NOT (violence AND murder AND rape AND gun AND torture AND tragic AND abuse AND sex)`
    );
    const allPoems = await Poem.find();
    const articles = currentNews.data.results;
    const notWanted = [
      "or",
      "and",
      "a",
      "by",
      "on",
      "when",
      "my",
      "his",
      "our",
      "to",
      "of",
      "from",
      "the",
      "when",
      "why",
      "should",
      "could",
      "may",
      "might",
      "where",
      "her",
      "all",
      "every",
      "was",
      "is",
      "are",
      "were",
      "at",
      "while",
      "as",
      "off",
      "this",
      "that",
      "these",
      "what",
      "she",
      "he",
      "they",
      "we",
      "one",
      "two",
      "three",
      "after",
      "before",
      "it",
      "been",
      "since",
      "just",
      "no",
      "an",
      "I",
      "not",
      "but",
      "in",
      "who",
      "their",
      "new",
      "with",
      "each",
      "be",
      "so",
      "for",
      "still",
      "on",
      "then",
      "without",
      "into",
      "has",
      "its",
      "take",
      "into",
      "can",
      "like",
      "URL",
      "AI",
      "de",
      "being",
      ",",
      "us",
      "use",
      "Dr",
      "do",
      "have",
      ".",
      "less",
      "through",
      "about",
      "used",
      "more",
      "first",
      "come",
      "other",
      "most",
      "I",
      "yet",
      "am",
      "till",
      "AM",
      "AD",
      "them",
      "G",
      "any",
      "-",
      "Mr",
      "me",
      "such",
      "will",
      "up",
      "your",
      "S",
      "which",
      "there",
      "had",
    ];

    let poemsRelated = [];
    articles.forEach((article) => {
      let poem = null;
      let word = "";
      for (let i = 0; i < allPoems.length; i++) {
        article.content.split(" ").forEach((eachWord) => {
          if (notWanted.includes(eachWord.toLowerCase()) === true) {
            return;
          }
          if (
            poem === null &&
            allPoems[i].text.toLowerCase().includes(eachWord.toLowerCase()) &&
            poemsRelated.includes(allPoems[i]) === false
          ) {
            poem = allPoems[i];
            word = eachWord;
          }
        });
      }
      poemsRelated.push(poem);
      article.relatedPoem = poem;
      article.relatedOwrd = word;
    });

    res.json(articles);
  } catch (error) {
    console.log(error);
  }
});

const authRouter = require("./auth.routes");
router.use("/auth", authRouter);

const uploadRoutes = require("./upload.routes");
router.use("/upload", uploadRoutes);

const userRouter = require("./user.routes");
router.use("/user", userRouter);

const poemRouter = require("./poem.routes");
router.use("/poem", poemRouter);

const poetRouter = require("./poet.routes");
router.use("/poet", poetRouter);

const newsRouter = require("./news.routes");
router.use("/news", newsRouter);

module.exports = router;
