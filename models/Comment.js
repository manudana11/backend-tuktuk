const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;

const CommentSchema = new mongoose.Schema({
        userId: {
            type:ObjectId, 
            ref:'User',
            required: [true, 'You must be logged']
        },
        postId: {
            type:ObjectId, 
            ref:'Post',
            required: [true, 'You must select a post']
        },
        bodyText: {
            type:String,
            required: [true, 'Where is your comment?']
        },
        likes: [{type:ObjectId, ref:'User'}],
        responses: [{
            userId: {type:ObjectId, ref:'User'},
            bodyText: String,
            likes: [{type:ObjectId, ref:'User'}],
        }],
}, { timestamps: true });

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;