const Board = require('../models/Board')
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
        console.log(!board.owner.equals(req.user.userId))
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