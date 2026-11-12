const Activity = require('../models/Activity')
const Board = require('../models/Board')
const User = require('../models/User')

module.exports.findActivity = async (req, res) => {
    try {
        const { boardId } = req.params;
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = 5;
        const skip = (page - 1) * limit;

        const [activities, total] = await Promise.all([
            Activity.find({ board: boardId })
                .sort({ createdAt: -1, _id: -1 })
                .skip(skip)
                .limit(limit)
                .populate('user', 'firstname username image')
                .lean(),
            Activity.countDocuments({ board: boardId })
        ]);

        console.log(activities)

        res.json({
            activities,
            pagination: { hasMore: skip + activities.length < total }
        });
    } catch (err) {
        res.status(500).json({ message: 'Could not load activity' });
    }
};
module.exports.getUserActivities = async (req, res) => {
    try {
        const { username } = req.params;
        const page = Number(req.query.page) || 1;
        const limit = 5;
        const skip = (page - 1) * limit;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const me = req.user.userId;
        const isSelf = user._id.equals(me)

        const query = {
            $or: [{ user: user._id }]
        }
        if (!isSelf) {

            const sharedBoards = await Board.find({
                $and: [
                    { $or: [{ owner: user._id }, { 'members.user': user._id }] },
                    { $or: [{ owner: me }, { 'members.user': me }] }
                ]
            }).select('_id');

            query.board = { $in: sharedBoards.map(b => b._id) };
        }

        // 2. Fetch the slice of activities
        const activities = await Activity.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('user', 'firstname image');

        // 3. Count total to know if there's more
        const total = await Activity.countDocuments(query);

        res.json({
            activities,
            pagination: {
                hasMore: (skip + activities.length) < total
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};