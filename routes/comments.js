const CommentController = require("../controllers/CommentController");

const express = require('express');
const { authentication, isYourComment } = require("../middlewares/authentication");
const router = express.Router();

router.post("/id/:_id", authentication, CommentController.create);
router.put("/id/:_id", authentication, isYourComment, CommentController.update);
router.delete("/id/:_id", authentication, isYourComment, CommentController.delete);
router.put("/likes/:_id", authentication, CommentController.like);
router.put("/dislikes/:_id", authentication, CommentController.dislike);
router.put("/response/:_id", authentication, CommentController.addResponse);
router.put("/likeresponse/:responseId", authentication, CommentController.likeResponse);
router.put("/dislikeresponse/:responseId", authentication, CommentController.dislikeResponse);

module.exports = router;