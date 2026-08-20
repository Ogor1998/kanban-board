
const Card = require('../models/Card')
const { uploadToCloudinary } = require('../cloudinary')


module.exports.createCard = async (req, res) => {
    const { title, description, priority, columnId } = req.body;
    const card = new Card({
        title,
        description,
        priority,
        columnId
    })

    if (req.files && req.files.length > 0) {

        const imageUrls = await Promise.all(
            req.files.map(async (file) => {
                const result = await uploadToCloudinary(file.buffer);
                return result.secure_url;
            })
        );

        card.images = imageUrls;
    }

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

module.exports.updateCard = async (req, res) => {
    const { id } = req.params;
    const { title, priority, description, columnId } = req.body;
    const card = await Card.findById(id);
    const updatedCard = {
        title,
        priority,
        description,
        columnId
    }
    if (req.files && req.files.length > 0) {

        const imageUrls = await Promise.all(
            req.files.map(async (file) => {
                const result = await uploadToCloudinary(file.buffer);
                return result.secure_url;
            })
        );

        updatedCard.images = [...(card.images || []), ...imageUrls];
    }
    const updateCard = await Card.findByIdAndUpdate(id, updatedCard,
        {
            returnDocument: "after",
            runValidators: true
        }
    )
    res.json({
        message: 'You updated this card',
        card: updateCard
    })
    console.log('card updated')

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