if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
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
const User = require('./models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

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
const secret = process.env.JWT_SECRET;


app.post('/register', async (req, res) => {
    const { firstname, lastname, username, password, email } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    const user = new User({
        firstname,
        lastname,
        username,
        password: hashedPassword,
        email
    })
    await user.save();
    console.log('this is the new user', user)
    res.json({
        message: "You've registered successfully",
        user: user
    })

})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username })
    console.log(user)
    if (!user) {
        return res.status(401).json({
            message: "Invalid username or password",
            isLoggedIn: false,
        });
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        return res.json({
            message: 'Invalid username or password',
            isLoggedIn: false
        })
    }

    const token = jwt.sign(
        { userId: user._id },
        secret,
        {
            expiresIn: "1h",
        }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: false,      // true in production with HTTPS
        sameSite: "lax",
        maxAge: 1000 * 60 * 60, // 1 hour
    });
    res.json({
        message: 'Logged in successfully',
        isLoggedIn: true,
        user: {
            id: user._id,
            username: user.username,
        }
    });
})

app.post('/logout', (req, res) => {
    res.clearCookie("token");
    res.json({
        message: "Logged out.",
    });
})


app.use((req, res, next) => {
    // get the token from the headers
    const token = req.headers.authorization;
    // verify the token
    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
});

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