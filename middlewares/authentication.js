const User = require("../models/User")
const Post = require('../models/Post');
const Comment = require("../models/Comment");
const jwt = require('jsonwebtoken');
require("dotenv").config();
const { JWT_SECRET } = process.env;

const authentication = async(req, res, next) => {
    try {
        const token = req.headers.authorization;
        const payload = jwt.verify(token, JWT_SECRET);
        const user = await User.findOne({ _id: payload._id, tokens: token });
        if (!user) {    
            return res.status(401).send({ message: 'You are not authorized' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error(error)
        return res.status(500).send({ error, message: 'there´s been a problem with the token' })
    }
}
const isAdmin = async(req, res, next) => {
    const admins = ['admin','superadmin'];
    if (!admins.includes(req.user.role)) {
        return res.status(403).send({
            message: 'You do not have permission'
        });
    }
    next();
}
const isAuthor = async(req, res, next) => {
    try {
        const post = await Post.findById(req.params._id);
        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        };
        if (post.userId.toString() !== req.user._id.toString()) {
            return res.status(403).send({ message: 'This is not your post' });
        }
        next();
    } catch (error) {
        console.error(error)
        return res.status(500).send({ error, message: 'Something went wrong checking the authority of the post.' })
    }
};
const isYourComment = async(req, res, next) => {
    try {
        const comment = await Comment.findById(req.params._id);
        if (!comment) {
            return res.status(404).send({ message: 'Comment not found' });
        };
        if (comment.userId.toString() !== req.user._id.toString()) {
            return res.status(403).send({ message: 'This is not your comment mate' });
        }
        next();
    } catch (error) {
        console.error(error)
        return res.status(500).send({ error, message: 'Something went wrong checking the authority of the post.' })
    }
}


module.exports = { authentication, isAdmin, isAuthor, isYourComment };