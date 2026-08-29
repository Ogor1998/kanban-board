const Comment = require('../models/Comment')

module.exports.allComments = async (req, res) => {
    const { cardID } = req.params;
    const comment = await Comment.find({ cardID }).populate({
        path: "author",
        select: "username image"
    });

    res.json(comment)
}

module.exports.commentCount = async (req, res) => {
    const { cardID } = req.params;
    const count = await Comment.countDocuments({ cardID })
    res.json({ count })
}


module.exports.createComment = async (req, res) => {
    const { content, cardID } = req.body;
    console.log('this is the user  making comment', req.user)
    const comment = new Comment({
        content,
        cardID,
        author: req.user.userId
    })
    await comment.save();
    await comment.populate('author', 'username image');
    res.json({ message: 'Created comment successfully', comment })
    console.log('comment created')
}

module.exports.deleteComment = async (req, res) => {
    const { commentID } = req.params;
    await Comment.findByIdAndDelete(commentID);
    res.json({
        message: 'You deleted your comment'
    })
    console.log('comment deleted')
}
