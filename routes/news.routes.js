const { default: axios } = require("axios");
const isAuthenticated = require("../middlewares/isAuthenticated");
const Poem = require("../models/Poem.model");

const router = require("express").Router();

//GET to show a list of articles with poems
router.get("/news-in-poems", isAuthenticated, async (req, res, next) => {
  try {
    const API_KEY = process.env.NEWS_API_KEY;
    const currentNews = await axios.get(
      `https://newsdata.io/api/1/news?apikey=${API_KEY}&language=en&q=father OR anger OR love OR game OR tender OR welcome OR name OR reputation OR men OR summer OR physicians OR mad OR thunder OR heart OR Moscow OR women OR railway OR moon OR sleeping OR treasure  NOT (violence AND murder AND rape AND gun AND torture AND tragic)`
    );
    const allPoems = await Poem.find();
    const articles = currentNews.data.results;
    const notWanted = [
      "or",
      "and",
      "a",
      "by",
      " on",
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
    ];

    articles.forEach((article) => {
      let poem = null;
      allPoems.forEach((eachPoem) => {
        article.content.split(" ").forEach((eachWord) => {
          if (notWanted.includes(eachWord.toLowerCase())) {
            return;
          }
          if (eachPoem.text.toLowerCase().includes(eachWord.toLowerCase())) {
            poem = eachPoem;
          } else if (typeof articles.relatedPoem !== undefined) {
            return;
          }
        });
        article.relatedPoem = poem;
      });
    });

    res.json(currentNews.data.results);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
