
const Card = require('../models/Card')
const User = require('../models/User')
const Column = require('../models/Column')
const Activity = require('../models/Activity')
const Notification = require('../models/Notification')
const { uploadToCloudinary } = require('../cloudinary')


module.exports.createCard = async (req, res) => {
    const { title, description, priority, columnId, dueDate } = req.body;
    const column = await Column.findById(columnId)
    const card = new Card({
        title,
        description,
        priority,
        columnId,
        dueDate
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
    await Activity.create({
        board: column.boardId,
        user: req.user.userId,
        action: 'Created a card',
        target: card.title
    })
    res.json({
        message: 'You added a new card',
        card
    })
    console.log(card)

}
module.exports.deleteCard = async (req, res) => {
    const { id } = req.params;
    const card = await Card.findByIdAndDelete(id);
    const column = await Column.findById(card.columnId)
    await Activity.create({
        board: column.boardId,
        user: req.user.userId,
        action: 'Deleted a card',
        target: card.title
    })
    res.json({
        message: 'You deleted the card'
    })
    console.log('card deleted')
}

module.exports.updateCard = async (req, res) => {
    const { id } = req.params;
    const { title, priority, description, columnId } = req.body;
    const card = await Card.findById(id);
    const column = await Column.findById(columnId)
    if (!card) return res.status(404).json({ message: 'Card not found' })
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
            returnDocument: 'after',
            runValidators: true
        }
    )
    await Activity.create({
        board: column.boardId,
        user: req.user.userId,
        action: 'Updated a card',
        target: card.title
    })

    res.json({
        message: 'You updated this card',
        card: updateCard
    })
    console.log('card updated')

}

module.exports.moveCard = async (req, res) => {
    const { activeId } = req.params;
    const { columnId } = req.body;
    const column = await Column.findById(columnId)
    const thisCard = await Card.findById(activeId)
    const card = await Card.findByIdAndUpdate(activeId, { columnId }, {
        returnDocument: 'after',
        runValidators: true
    })
    await Activity.create({
        board: column.boardId,
        user: req.user.userId,
        action: 'Moved a card',
        target: thisCard.title
    })
    console.log('moved card')
    res.json(card)
}

module.exports.addMember = async (req, res) => {
    const { cardId } = req.params;
    const { memberID } = req.body;
    const card = await Card.findById(cardId)
    const user = await User.findById(memberID)
    const column = await Column.findById(card.columnId)
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
    if (!column) {
        return res.status(404).json({
            message: 'Column not found'
        })
    }
    card.members.push(memberID)

    await card.save();
    await card.populate('members');
    await Activity.create({
        board: column.boardId,
        user: req.user.userId,
        action: 'Invited a member',
        target: user.username
    })


    await Notification.create({
        recipient: memberID,
        sender: req.user.userId,
        message: 'Invited you to join this card',
        link: `/cards/${cardId}`,
        type: 'CARD_ASSIGNED',
        isRead: false,
    })


    res.json({
        message: 'You added this member to the card',
        card
    })
    console.log('You added this member to the card')

}

module.exports.deleteMember = async (req, res) => {
    const { cardId, memberID } = req.params;
    const card = await Card.findByIdAndUpdate(cardId, {
        $pull: {
            members: memberID
        }
    }, { returnDocument: 'after' })
    const user = await User.findById(memberID)
    const column = await Column.findById(card.columnId)

    await Activity.create({
        board: column.boardId,
        user: req.user.userId,
        action: 'Deleted a member',
        target: user?.username || memberID
    })
    await Notification.create({
        recipient: memberID,
        sender: req.user.userId,
        message: 'Removed you from this card',
        link: `/cards/${cardId}`,
        type: 'MEMBER_REMOVED',
        isRead: false,
    })

    res.json({
        message: "You've removed this user from card",
        card
    })
}