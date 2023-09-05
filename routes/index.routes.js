const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

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

const newsRouter = require ("./news.routes")
router.use ("/news", newsRouter)

module.exports = router;
