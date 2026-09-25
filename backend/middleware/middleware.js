const Board = require('../models/Board')
const Comment = require('../models/Comment')
const Card = require('../models/Card')
const { boardSchema, cardSchema, columnSchema, userSchema, commentSchema } = require('../schemas')
const AppError = require('../utils/AppError')
module.exports.isBoardOwner = async (req, res, next) => {
    console.log('this is thhe user object', req.user)
    try {
        const { boardId } = req.params;
        const board = await Board.findById(boardId)
        if (!board) {
            return res.status(404).json({
                message: 'Board not found'
            })
        }
        if (!board.owner.equals(req.user.userId)) {
            return res.status(403).json({
                message: 'You do not have permission to do that'
            })
        }
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports.isBoardMemeber = async (req, res, next) => {
    try {
        const { boardId } = req.params;
        const board = await Board.findById(boardId)
        const isOwner = board.owner.equals(req.user.userId)
        const isMember = board.members.some(m => m.user.equals(req.user.userId))
        if (!isOwner && !isMember) {
            return res.status(403).json({ message: "Access denied" })
        }
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
        next(err)
    }
}


module.exports.isCardMember = async (req, res, next) => {
    try {
        const { cardId } = req.params;
        const { memberID } = req.body
        const card = await Card.findById(cardId)
        if (!memberID) {
            return res.status(400).json({ message: 'Target member ID is required' });
        }
        if (!card) {
            return res.status(404).json({
                message: 'Card not found'
            })
        }
        const isTheSameUser = req.user.userId.toString() === memberID.toString();
        const isMember = card.members.some(m => m._id.equals(req.user.userId))
        if (isMember) {
            return res.status(409).json({
                message: 'This user is already a member'
            })
        }
        if (isTheSameUser) {
            return res.status(403).json({
                message: "You can't add yourself to card"
            })
        }
        next();
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports.isCommentAuthor = async (req, res, next) => {
    try {
        const { commentID } = req.params;
        const comment = await Comment.findById(commentID)
        if (!comment) {
            res.status(404).json({
                message: 'Comment not found'
            })
        }
        if (!comment.author._id.equals(req.user.userId)) {
            return res.status(403).json({
                message: 'You do not have permission to do that'
            })
        }
        next();

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}



module.exports.validateBoard = (req, res, next) => {
    const { error } = boardSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400)
    } else {
        next();
    }
}
module.exports.validateColumn = (req, res, next) => {
    const { error } = columnSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400)
    } else {
        next();
    }
}
module.exports.validateCard = (req, res, next) => {
    const { error } = cardSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400)
    } else {
        next();
    }
}


module.exports.validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400)
    } else {
        next();
    }
}
