const User = require('../models/User')
const { uploadToCloudinary } = require('../cloudinary')


module.exports.findProfile = async (req, res) => {
    const user = await User.findOne({
        username: req.params.username
    }).select("-password")
    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        })
    }
    res.json(user)
}


module.exports.updateProfile = async (req, res) => {
    const { firstname, lastname, email } = req.body;
    const updateData = {
        firstname,
        lastname,
        email
    }
    if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer)
        updateData.image = result.secure_url
    }
    console.log('this is the body', updateData)
    const updatedUser = await User.findOneAndUpdate({ _id: req.user.userId }, updateData, { new: true, runValidators: true }).select("-password")
    if (!updatedUser) return res.status(404).json({ message: "User not found" })
    res.json({
        message: "Profile updated successfully",
        user: updatedUser
    });
    console.log('this is the updated user:', updatedUser)
}