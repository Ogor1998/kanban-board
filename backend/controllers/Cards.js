const Card = require('../models/Card')


module.exports.createCard = async (req, res) => {
    const { title, description, priority, columnId } = req.body;
    const card = new Card({
        title,
        description,
        priority,
        columnId
    })
    await card.save();
    res.json({
        message: 'You added a new card',
        card
    })
    console.log(card)

}
module.exports.deleteCard = async (req, res) => {
    const { id } = req.params;
    await Card.findByIdAndDelete(id);
    res.json({
        message: 'You deleted the card'
    })
    console.log('card deleted')
}

module.exports.moveCard = async (req, res) => {
    const { activeId } = req.params;
    const { columnId } = req.body;
    const card = await Card.findByIdAndUpdate(activeId, { columnId }, {
        returnDocument: "after",
        runValidators: true
    })
    res.json(card)

}