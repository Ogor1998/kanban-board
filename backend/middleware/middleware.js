const Board = require('../models/Board')
const Comment = require('../models/Comment')
const Card = require('../models/Card')
const Column = require('../models/Column')
const { boardSchema, cardSchema, columnSchema, userSchema, commentSchema } = require('../schemas')
const AppError = require('../utils/AppError')

const checkBoardAccess = async (boardId, userId) => {
    const board = await Board.findById(boardId)
    if (!board) return { status: 404, message: 'Board not found' }

    const isOwner = board.owner.equals(userId)
    const isMember = board.members.some(m => m.user.equals(userId))
    if (!isOwner && !isMember) return { status: 403, message: 'Access denied' }

    return null   // null means allowed
}





// Route has a card id: /cards/:id  (or :cardId / :activeId)
module.exports.canAccessCard = async (req, res, next) => {
    const cardId = req.params.id || req.params.cardId || req.params.activeId
    const card = await Card.findById(cardId)
    if (!card) return res.status(404).json({ message: 'Card not found' })

    const column = await Column.findById(card.columnId)
    if (!column) return res.status(404).json({ message: 'Column not found' })

    const problem = await checkBoardAccess(column.boardId, req.user.userId)
    if (problem) return res.status(problem.status).json({ message: problem.message })
    next()
}

// Route has a column id: /columns/:id
module.exports.canAccessColumn = async (req, res, next) => {
    const column = await Column.findById(req.params.id)
    if (!column) return res.status(404).json({ message: 'Column not found' })

    const problem = await checkBoardAccess(column.boardId, req.user.userId)
    if (problem) return res.status(problem.status).json({ message: problem.message })
    next()
}
module.exports.canAccessColumnFromBody = async (req, res, next) => {
    const { columnId } = req.body;
    const column = await Column.findById(columnId)
    if (!column) return res.status(404).json({ message: 'Column not found' })
    const problem = await checkBoardAccess(req.body.boardId, req.user.userId)
    if (problem) return res.status(problem.status).json({ message: problem.message })
    next()
}

// Board id is in the body: POST /columns  (body.boardId)
module.exports.canAccessBoardFromBody = async (req, res, next) => {
    const problem = await checkBoardAccess(req.body.boardId, req.user.userId)
    if (problem) return res.status(problem.status).json({ message: problem.message })
    next()
}

module.exports.canAccessComments = async (req, res, next) => {
    const cardID = req.params.cardID || req.body.cardID
    const card = await Card.findById(cardID)
    if (!card) return res.status(404).json({ message: 'Card not found' })
    const column = await Column.find(card.columnId)
    if (!column) return res.status(404).json({ message: 'Column not found' })
    const problem = await checkBoardAccess(column.boardId, req.user.userId)
    if (problem) return res.status(problem.status).json({ message: problem.message })
    next()
}

module.exports.isBoardOwner = async (req, res, next) => {
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

module.exports.isBoardMember = async (req, res, next) => {
    try {
        const { boardId } = req.params;
        const board = await Board.findById(boardId)
        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }
        const isOwner = board.owner.equals(req.user.userId)
        const isMember = board.members.some(m => m.user.equals(req.user.userId))
        if (!isOwner && !isMember) {
            return res.status(403).json({ message: "Access denied" })
        }
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
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
        const isMember = card.members.some(m => m.toString() === memberID.toString())
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
            return res.status(404).json({
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
