const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");

const PostController = {
  async create(req, res) {
    try {
      if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded' });
      };
      const imgpost = req.file.path;
      const userPost = ({ ...req.body, imgpost, userId: req.user._id })
      const post = await Post.create(userPost)
      console.log(res.post)
      await User.findByIdAndUpdate(
        req.user._id,
        { $push: { posts: post._id } },
        { new: true }
      );
      res.status(201).send({ message: `${req.user.name} created post successfully.`, post })
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error during post creation.", error });
    }
  },
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const posts = await Post.find().limit(limit).skip((page - 1) * limit);
      res.send(posts);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Something  went wrong.", error });
    }
  },
  async update(req, res) {
    try {
      if (!req.file) {
        const update = req.body
        const post = await Post.findByIdAndUpdate(
          req.params._id,
          update,
          { new: true }
        );
        res.send({ message: "Post successfully updated", post });
      } else {
        const imgpost = req.file.path;
        const update= {...req.body, imgpost}
        const post = await Post.findByIdAndUpdate(
          req.params._id,
          update,
          { new: true }
        );
        res.send({ message: "Post successfully updated", post });

      }
    } catch (error) {
      console.error(error);
    }
  },
  async delete(req, res) {
    try {
      const post = await Post.findByIdAndDelete(req.params._id);
      await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { posts: post._id } },
        { new: true }
      );
      const commentsIds = post.commentsIds.map(comment => comment._id);
      await Comment.deleteMany({
        postId:req.params._id
      });
      await User.updateMany(
        { comments: { $in: commentsIds } },
        { $pull: { comments: { $in: commentsIds } } }
      );
      res.send({ message: "Post deleted", post });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "There was a problem trying to remove the post" });
    }
  },
  async getById(req, res) {
    try {
      const post = await Post.findById(req.params._id);
      res.send(post);
    } catch (error) {
      console.error(error);
    }
  },
  async getPostByName(req, res) {
    try {
      if (req.query.caption.length > 20) {
        return res.status(400).send('Búsqueda demasiado larga')
      }
      const caption = new RegExp(req.query.caption, "i");
      const post = await Post.find({ caption });
      res.send(post);
    } catch (error) {
      console.log(error);
    }
  },
  async getInfo(req, res) {
    try {
      const post = await Post.find()
        .populate({
          path: "commentsIds",
          populate: {
            path: "userId",
            select: "userName name"
          },
          select: "bodyText likes responses"
        })
        .populate({
          path: "userId",
          select: "userName name"
        });
      res.send(post);
    } catch (error) {
      console.error(error);
    }
  },
  async like(req, res) {
    try {
      const likeExist = await Post.findOne({ _id: req.params._id, likes: req.user._id });
      if (likeExist) {
        return res.status(400).send({ message: "You alrready like this post" });
      }
      const post = await Post.findByIdAndUpdate(
        req.params._id,
        { $push: { likes: req.user._id } },
        { new: true }
      );
      await User.findByIdAndUpdate(
        req.user._id,
        { $push: { likes: req.params._id } },
        { new: true }
      );
      res.send(post);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "There was a problem with your like" });
    }
  },
  async dislike(req, res) {
    try {
      const likeExist = await Post.findOne({ _id: req.params._id, likes: req.user._id });
      if (!likeExist) {
        return res.status(400).send({ message: "You have not like this post" });
      };
      const post = await Post.findByIdAndUpdate(
        req.params._id,
        { $pull: { likes: req.user._id } },
        { new: true }
      );
      await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { likes: req.params._id } },
        { new: true }
      );
      res.send(post);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "There was a problem with your like" });
    }
  },
};

module.exports = PostController;