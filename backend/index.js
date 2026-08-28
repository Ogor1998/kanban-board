if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose')
const cors = require('cors')
const boardRoutes = require('./routes/boardRoutes')
const cardRoutes = require('./routes/cardRoutes')
const columnRoutes = require('./routes/columnRoutes')
const userRoutes = require('./routes/userRoutes')
const profileRoutes = require('./routes/profileRoutes')
const AppError = require('./utils/AppError')
const User = require('./models/User')
const cookieParser = require('cookie-parser')
const { isLoggedIn } = require('./middleware/auth')
const { uploadToCloudinary } = require('./cloudinary')
const { upload } = require('./cloudinary')
const Comment = require('./models/Comment')



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
app.use(cookieParser());

app.use('/columns', columnRoutes)
app.use('/cards', cardRoutes)
app.use('/boards', boardRoutes)
app.use('/', userRoutes)
app.use('/profile', profileRoutes)

const secret = process.env.JWT_SECRET;


app.get("/check-auth", isLoggedIn, async (req, res) => {
    const user = await User.findById(req.user.userId).select("-password");

    res.json({
        isLoggedIn: true,
        user,
    });
});


app.post('/logout', (req, res) => {
    res.clearCookie("token");
    res.json({
        message: "Logged out.",
    });
})


app.get('/comments/:cardID', async (req, res) => {
    const { cardID } = req.params;
    const comment = await Comment.find({ cardID }).populate({
        path: "author",
        select: "username image"
    });

    res.json(comment)
})

app.get('/comments/:cardID/count', async (req, res) => {
    const { cardID } = req.params;
    const count = await Comment.countDocuments({ cardID })
    res.json({ count })
})

app.post('/comments', isLoggedIn, async (req, res) => {
    const { content, cardID } = req.body;
    console.log('this is the user  making comment', req.user)
    const comment = new Comment({
        content,
        cardID,
        author: req.user.userId
    })
    await comment.save();
    res.json({ message: 'Created comment successfully', comment })
    console.log('comment created')

})

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