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




app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})