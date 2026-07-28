const Board = require('../models/Board')
const Card = require('../models/Card')
const Column = require('../models/Column')


module.exports.allColumns = async (req, res) => {
    const { boardId } = req.params;
    const board = await Board.findById(boardId)
    const columns = await Column.find({ boardId: boardId }).sort('order');
    if (!columns) {
        return next(new AppError('Columns not found', 404));
    }

    const columnsWithCard = await Promise.all(
        columns.map(async (col) => {
            const cards = await Card.find({ columnId: col._id }).sort('order')
            return { ...col.toObject(), cards }
        })
    )
    res.json({
        board: board,
        columns: columnsWithCard,
        message: 'You are on the right track'
    })
}

module.exports.createColumn = async (req, res) => {
    const { title, boardId } = req.body;
    const columnCount = await Column.countDocuments({ boardId })
    const newColumn = new Column({
        title,
        boardId,
        order: columnCount,

    })
    await newColumn.save();
    res.json({
        message: 'You have added a column',
        column: { ...newColumn.toObject(), cards: [] }
    })
    console.log('You created a new column')
}

module.exports.updateColumn = async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const column = await Column.findByIdAndUpdate(id, { title }, {
        returnDocument: "after",     // Returns the modified document instead of the old one
        runValidators: true // Ensures the updates adhere to your Mongoose schema
    });

    if (!column) {
        return res.status(404).json({ message: 'Column not found' });
    }
    res.json({
        message: 'You updated this column title',
        column
    })
    console.log('Title updated')
}

module.exports.deleteColumn = async (req, res) => {
    const { id } = req.params;
    const columns = await Column.findByIdAndDelete(id);
    res.json({
        message: 'You deleted the column',
        columns: columns
    })
    console.log('Its done')
}




