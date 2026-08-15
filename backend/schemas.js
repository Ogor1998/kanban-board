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
    title: Joi.string().required()
})

