const mongoose = require('mongoose');
const Board = require('../models/Board');
const Column = require('../models/Column');
const Card = require('../models/Card');

mongoose.connect('mongodb://127.0.0.1:27017/kanban');

const seedDB = async () => {
    // Clear existing data
    await Board.deleteMany({});
    await Column.deleteMany({});
    await Card.deleteMany({});

    // Create Board
    const board = await Board.create({
        title: 'My First Project',
    });

    // Create Columns
    const todo = await Column.create({ title: 'To Do', boardId: board._id, order: 0 });
    const inProgress = await Column.create({ title: 'In Progress', boardId: board._id, order: 1 });
    const review = await Column.create({ title: 'In Review', boardId: board._id, order: 2 });
    const done = await Column.create({ title: 'Done', boardId: board._id, order: 3 });

    // To Do Cards
    await Card.create([
        {
            title: 'Set up project structure',
            description: 'Initialize repo, install dependencies, set up folder structure',
            columnId: todo._id,
            priority: 'high',
            order: 0
        },
        {
            title: 'Design database schema',
            description: 'Plan out models for Board, Column, and Card',
            columnId: todo._id,
            priority: 'high',
            order: 1
        },
        {
            title: 'Create wireframes',
            description: 'Sketch out the UI layout for the board view',
            columnId: todo._id,
            priority: 'medium',
            order: 2
        },
        {
            title: 'Write API documentation',
            description: 'Document all endpoints with request/response examples',
            columnId: todo._id,
            priority: 'low',
            order: 3
        },
    ]);

    // In Progress Cards
    await Card.create([
        {
            title: 'Build backend routes',
            description: 'Set up Express routes for boards, columns, and cards',
            columnId: inProgress._id,
            priority: 'high',
            order: 0
        },
        {
            title: 'Implement drag and drop',
            description: 'Use @dnd-kit to enable card dragging between columns',
            columnId: inProgress._id,
            priority: 'high',
            order: 1
        },
        {
            title: 'Style column components',
            description: 'Add CSS for column layout and card appearance',
            columnId: inProgress._id,
            priority: 'medium',
            order: 2
        },
    ]);

    // In Review Cards
    await Card.create([
        {
            title: 'User authentication',
            description: 'Login, register, and session management with Passport',
            columnId: review._id,
            priority: 'high',
            order: 0
        },
        {
            title: 'Add card form validation',
            description: 'Validate title is required and description has a max length',
            columnId: review._id,
            priority: 'medium',
            order: 1
        },
    ]);

    // Done Cards
    await Card.create([
        {
            title: 'Set up MongoDB connection',
            description: 'Connect Mongoose to local MongoDB instance',
            columnId: done._id,
            priority: 'high',
            order: 0
        },
        {
            title: 'Initialize React app',
            description: 'Create Vite project and install core dependencies',
            columnId: done._id,
            priority: 'medium',
            order: 1
        },
        {
            title: 'Set up CORS and session middleware',
            description: 'Configure Express middleware for cross-origin requests',
            columnId: done._id,
            priority: 'low',
            order: 2
        },
    ]);

    console.log('Database seeded successfully');
    mongoose.connection.close();
}

seedDB().catch(err => {
    console.log(err);
    mongoose.connection.close();
});