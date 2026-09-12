
const Card = require('../models/Card')
const User = require('../models/User')
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

module.exports.addMember = async (req, res) => {
    const { cardId } = req.params;
    const { memberID } = req.body;
    const card = await Card.findById(cardId)
    const user = await User.findById(memberID)
    if (!card) {
        return res.status(404).json({
            message: 'Card not found'
        })
    }
    if (!user) {
        return res.status(404).json({
            message: 'Card not found'
        })
    }
    card.members.push(memberID)
    await card.save();
    await card.populate('members');
    res.json({
        message: 'You added this member to the card',
        card
    })
    console.log('You added this memebr to the card')

}

module.exports.deleteMember = async (req, res) => {
    const { cardId, memberID } = req.params;
    const card = await Card.findByIdAndUpdate(cardId, {
        $pull: {
            members: memberID
        }
    }, { new: true })
    res.json({
        message: "You've removed this user from card",
        card
    })
}