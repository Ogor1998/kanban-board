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

    const page = Number(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;


    // 2. Fetch the slice of activities
    const notification = await Notification.find({ recipient: user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('sender', 'firstname image');

    if (!notification) {
        return res.status(404).json({
            message: 'There are no notifications yet'
        })
    }

    // 3. Count total to know if there's more
    const total = await Notification.countDocuments({ recipient: user._id });

    res.json({
        notification,
        pagination: {
            hasMore: (skip + notification.length) < total
        }
    });
}


module.exports.openNotification = async (req, res) => {
    const { notificationId } = req.params;
    const notification = await Notification.findById(notificationId)
    if (!notification) {
        return res.status(404).json({
            message: 'Notification not found'
        })
    }
    console.log('this is the specific notification', notification)
    notification.isRead = !notification.isRead;

    console.log('notification opened')

    await notification.save();
    res.json({
        message: 'read notification',
        notification
    })
}