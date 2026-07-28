const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose')
const cors = require('cors')
const Board = require('./models/Board')
const Column = require('./models/Column')
const Card = require('./models/Card')
const boardRoutes = require('./routes/boardRoutes')
const cardRoutes = require('./routes/cardRoutes')
const columnRoutes = require('./routes/columnRoutes')
const AppError = require('./utils/AppError')

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

app.use('/columns', columnRoutes)
app.use('/cards', cardRoutes)
app.use('/boards', boardRoutes)


app.all(/(.*)/, (req, res, next) => {
    next(new AppError('Page not found', 404))
})


app.use((err, req, res, next) => {

    console.error(err); // ← log full error server-side for debugging

    // Invalid MongoDB ObjectId


    if (err.name === "CastError") {
        return res.status(400).json({
            message: `Invalid ID: ${err.value} is not a valid ID`
        });
    }

    // Mongoose validation errors (missing required fields, etc)
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ message: messages.join(", ") });
    }

    // Duplicate key error (e.g. unique email/username already exists)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(409).json({ message: `${field} already exists` });
    }


    // Multer file upload errors
    if (err.name === "MulterError") {
        return res.status(400).json({ message: err.message });
    }

    const { statusCode = 500, message = 'something went wrong' } = err;
    res.status(statusCode).json({ statusCode, message })
})




app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})