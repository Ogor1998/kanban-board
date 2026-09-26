const Notification = require('../models/Notification')
const User = require('../models/User')


module.exports.findNotifications = async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ username })
    if (!user) {
        return res.status(404).json({
            message: "This user doesn't exist"
        })
    }
    const notifcation = await Notification.find({ recipient: user._id }).populate('sender', 'firstname image');
    if (!notifcation) {
        return res.status(404).json({
            message: 'There are no notifications yet'
        })
    }
    res.json(notifcation)
}