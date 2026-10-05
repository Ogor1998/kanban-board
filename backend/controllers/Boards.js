
const Board = require('../models/Board')
const User = require('../models/User')
const AppError = require('../utils/AppError')
const Activity = require('../models/Activity')
const Column = require('../models/Column')
const Card = require('../models/Card')
const Comment = require('../models/Comment')
const Notification = require('../models/Notification')
const { io, connectedUsers } = require('../index')


module.exports.allBoards = async (req, res) => {
    console.log(req.user)
    const boards = await Board.find({ owner: req.user.userId });
    if (boards.length === 0) {
        return res.json({ boards: [] });
    }

    // 2. Loop through each board and count its columns and cards
    const boardsWithCounts = await Promise.all(
        boards.map(async (board) => {
            // Get all column IDs belonging to this specific board
            const columnIds = await Column.find({ boardId: board._id }).distinct('_id');

            // Count cards inside those columns
            const cardsCount = await Card.countDocuments({ columnId: { $in: columnIds } });

            return {
                ...board.toObject(), // convert mongoose doc to plain JS object
                columnsCount: columnIds.length,
                cardsCount: cardsCount
            };
        })
    );

    res.json({ boards: boardsWithCounts });
}

module.exports.findBoard = async (req, res) => {
    const { boardId } = req.params;
    const board = await Board.findById(boardId).populate('owner', 'firstname lastname username image')
        .populate('members.user', 'firstname lastname username email image')
    if (!board) {
        return res.status(404).json({
            message: 'Board not found'
        })
    }

    res.json(board)
}
module.exports.findUserBoard = async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ username })
    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        });
    }
    // console.log('this is the user', user)
    const board = await Board.find({
        $or: [
            { owner: user._id },
            { 'members.user': user._id }
        ]
    })
    const boardCount = await Board.countDocuments({ owner: user._id })
    const commentsCount = await Comment.countDocuments({ author: user._id })
    if (!board) {
        return res.status(404).json({
            message: 'Board not found'
        })
    }
    res.json({
        board,
        boardCount,
        commentsCount
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
        owner: req.user.userId,
    });

    await board.save();

    await Column.create({ title: 'Todo', boardId: board._id, order: 1 })
    await Column.create({ title: 'In Progress', boardId: board._id, order: 2 })
    await Column.create({ title: 'In Review', boardId: board._id, order: 3 })
    await Column.create({ title: 'Done', boardId: board._id, order: 4 })


    await Activity.create({
        board: board._id,
        user: req.user.userId,
        action: 'Created a board title',
        target: board.title
    })

    console.log('this is the new board', board)
    res.json({ message: 'You created a new board', board: board })
}

module.exports.updateBoard = async (req, res) => {
    const { boardId } = req.params;
    const { title } = req.body;
    const board = await Board.findByIdAndUpdate(boardId, { title }, {
        returnDocument: 'after',
        runValidators: true // Ensures the updates adhere to your Mongoose schema
    })
    if (!board) {
        return res.status(404).json({
            message: 'Board not found'
        })
    }
    await Activity.create({
        board: board._id,
        user: req.user.userId,
        action: 'Updated a board title',
        target: board.title
    })


    res.json({
        message: "You've updated this board title",
        board
    })
    console.log('board updated')
}

module.exports.deleteBoard = async (req, res) => {
    const { boardId } = req.params;
    const board = await Board.findByIdAndDelete(boardId)
    await Activity.create({
        board: board._id,
        user: req.user.userId,
        action: 'Deleted a board',
        target: board.title
    })

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
    if (!board) {
        return res.status(404).json({
            message: 'Board not found'
        })
    }
    const user = await User.findById(memberID)
    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        })
    }
    board.members.push({ user: memberID, role: permissions || 'member' })
    await board.save();
    await Activity.create({
        board: boardId,
        user: req.user.userId,
        action: 'Invited a board member',
        target: user.firstname
    })

    const notification = await Notification.create({
        recipient: memberID,
        sender: req.user.userId,
        message: 'Invited you to joined board',
        link: `/columns/${boardId}`,
        type: 'BOARD_INVITE',
        isRead: false,
    })

    const recipientUserId = connectedUsers[memberID];
    if (recipientUserId) {
        io.to(recipientUserId).emit('notification', notification)
    }

    res.json({
        message: 'Permisson Granted',
        board
    })
}


module.exports.deleteMember = async (req, res) => {
    const { boardId, memberID } = req.params;
    const board = await Board.findById(boardId)
    if (!board) {
        return res.status(404).json({
            message: 'board not found'
        })
    }
    const user = await User.findById(memberID);
    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        })
    }

    board.members.pull({ _id: memberID })

    await board.save();
    await Activity.create({
        board: boardId,
        user: req.user.userId,
        action: 'Removed you from board',
        target: user.firstname
    })

    const notification = await Notification.create({
        recipient: memberID,
        sender: req.user.userId,
        message: 'Removed you from board',
        link: `/columns/${boardId}`,
        type: 'BOARD_INVITE',
        isRead: false,
    })


    const recipientUserId = connectedUsers[memberID];
    if (recipientUserId) {
        io.to(recipientUserId).emit('notification', notification)
    }

    res.json({
        message: 'Deleted Member successfully'
    })

}