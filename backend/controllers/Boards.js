
const Board = require('../models/Board')
const AppError = require('../utils/AppError')

module.exports.allBoards = async (req, res) => {
    const board = await Board.find({})
    if (!board) {
        return next(new AppError('Board not found', 404));
    }
    res.json({
        board: board,
        message: 'You are on the right track'
    })
}
module.exports.createBoard = async (req, res) => {
    console.log(req.body)
    const { title } = req.body;
    if (!title?.trim()) {
        return res.status(400).json({
            message: "Board title is required",
        });
    }

    const board = new Board({
        title: title.trim(),
    });
    await board.save();
    console.log('this is the new board', board)
    res.json({ message: 'You created a new board', board: board })
}
