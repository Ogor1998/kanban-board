const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose')
const cors = require('cors')
const Board = require('./models/Board')
const Column = require('./models/Column')
const Card = require('./models/Card')

mongoose.connect("mongodb://127.0.0.1:27017/kanban").then(() => {
    console.log(`Mongo Connection Active`)
}).catch((err) => {
    console.log(`Mongo Failed Because ${err}`)
})
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.get('/boards', async (req, res) => {
    const board = await Board.find({})
    res.json({
        board: board,
        message: 'You are on the right track'
    })
})

app.post('/boards', async (req, res) => {
    console.log(req.body)
    const { title } = req.body;
    const board = new Board({ title });
    await board.save();
    console.log('this is the new board', board)
    res.json({ message: 'You have a new board', board: board })
})
app.get('/columns/:boardId', async (req, res) => {
    const { boardId } = req.params;
    const board = await Board.findById(boardId)
    const columns = await Column.find({ boardId: boardId }).sort('order');
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
})

app.post('/columns', async (req, res) => {
    const { title, boardId } = req.body;
    const columnCount = await Column.countDocuments({ boardId })
    const newColumn = new Column({
        title,
        boardId,
        order: columnCount
    })
    await newColumn.save();
    res.json({
        message: 'You have added a column',
        column: newColumn
    })
    console.log('You created a new column')
})

app.put('/columns/:id', async (req, res) => {
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
})


app.delete('/columns/:id', async (req, res) => {
    const { id } = req.params;
    const columns = await Column.findByIdAndDelete(id);
    res.json({
        message: 'You deleted the column',
        columns: columns
    })
    console.log('Its done')
})


app.post('/cards', async (req, res) => {
    const { title, description, priority, columnId } = req.body;
    const card = new Card({
        title,
        description,
        priority,
        columnId
    })
    await card.save();
    res.json({
        message: 'You add a new card',
        card
    })
    console.log(card)

})


app.delete('/cards/:id', async (req, res) => {
    const { id } = req.params;
    await Card.findByIdAndDelete(id);
    res.json({
        message: 'You deleted the card'
    })
    console.log('card deleted')
})

// app.get('/columns/:boardId/cards/:cardId', async())



app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})