const Joi = require('joi')

module.exports.boardSchema = Joi.object({
    title: Joi.string().required()
})

module.exports.cardSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    priority: Joi.string()

})

module.exports.columnSchema = Joi.object({
    title: Joi.string().required(),
    boardId: Joi.string().required()
})
module.exports.userSchema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    firstname: Joi.string(),
    lastname: Joi.string()
})

module.exports.commentSchema = Joi.object({
    content: Joi.string().required(),
    cardID: Joi.string().required(),
})
