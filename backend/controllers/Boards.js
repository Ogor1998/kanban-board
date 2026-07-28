
const Board = require('../models/Board')

module.exports.allBoards = async (req, res) => {
    const board = await Board.find({})
    res.json({
        board: board,
        message: 'You are on the right track'
    })
}
module.exports.createBoard = async (req, res) => {
    console.log(req.body)
    const { title } = req.body;
    const board = new Board({ title });
    await board.save();
    console.log('this is the new board', board)
    res.json({ message: 'You have a new board', board: board })
}
