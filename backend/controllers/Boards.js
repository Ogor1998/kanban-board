
const Board = require('../models/Board')
const User = require('../models/User')
const AppError = require('../utils/AppError')

module.exports.allBoards = async (req, res) => {
    console.log(req.user)
    const board = await Board.find({ owner: req.user.userId })
    if (board.length === 0) {
        return res.status(404).json({
            message: "You don't have any boards yet"
        });
    }
    res.json({
        board: board,
        // message: 'You are on the right track'
    })
}

module.exports.findBoard = async (req, res) => {
    const { boardId } = req.params;
    const board = await Board.findById(boardId).populate('owner', 'firstname lastname username image')
        .populate('members.user', 'firstname lastname username email image')
    if (!board) {
        res.status(404).json({
            message: 'Board not found'
        })
    }
    res.json(board)
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
        owner: req.user.userId,
    });
    await board.save();
    console.log('this is the new board', board)
    res.json({ message: 'You created a new board', board: board })
}

module.exports.updateBoard = async (req, res) => {
    const { boardId } = req.params;
    const { title } = req.body;
    const board = await Board.findByIdAndUpdate(boardId, { title }, {
        new: true,
        runValidators: true // Ensures the updates adhere to your Mongoose schema
    })
    if (!board) {
        return res.status(404).json({
            message: 'Board not found'
        })
    }
    res.json({
        message: "You've updated this board title",
        board
    })
    console.log('board updated')
}

module.exports.deleteBoard = async (req, res) => {
    const { boardId } = req.params;
    const board = await Board.findByIdAndDelete(boardId)
    res.json({
        message: "You've deleted the board",
        board: board
    })
    console.log('backend delete called')
}

module.exports.inviteMember = async (req, res) => {
    const { memberID, permissions } = req.body;
    const { boardId } = req.params;
    const board = await Board.findById(boardId)
    const user = await User.findById(memberID)
    const alreadyMember = board.members.some(m => m.user.equals(memberID))
    if (alreadyMember) return res.status(400).json({
        message: 'User already a member'
    });
    if (!board) {
        return res.json({
            message: 'Board not found'
        })
    }
    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        })
    }

    board.members.push({ user: memberID, role: permissions || 'member' })
    await board.save();
    res.json({
        message: 'Permisson Granted',
        board
    })
}