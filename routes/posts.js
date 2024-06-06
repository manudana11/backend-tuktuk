const express = require('express');
const PostController = require('../controllers/PostController');
const router = express.Router();
const { authentication, isAdmin, isAuthor } = require("../middlewares/authentication");
const { imgLoad } = require('../middlewares/multer');


router.post("/", authentication, imgLoad, PostController.create);
router.get("/", PostController.getAll);
router.put("/id/:_id", authentication,imgLoad, isAuthor, PostController.update);
router.delete("/id/:_id", authentication, isAuthor, PostController.delete);
router.get("/id/:_id", authentication, PostController.getById);
router.get("/caption", authentication, PostController.getPostByName);
router.get("/allPosts", PostController.getInfo);
router.put("/likes/:_id", authentication, PostController.like);
router.put("/dislikes/:_id", authentication, PostController.dislike);

module.exports = router;