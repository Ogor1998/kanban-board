const Activity = require('../models/Activity')

module.exports.findActivity = async (req, res) => {
    const { boardId } = req.params;
    const activity = await Activity.find({ board: boardId }).sort('-createdAt').populate('user', 'firstname username image')
        .sort('-createdAt')
        .limit(50)
    res.json(activity)
}