const Board = require('../models/Board')
const { boardSchema, cardSchema, columnSchema } = require('../schemas')
const AppError = require('../utils/AppError')
module.exports.isAuthor = async (req, res, next) => {
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