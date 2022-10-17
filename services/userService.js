const User = require('../models/User');

exports.getOne = (userId) => User.findById(userId);
exports.addPublication = async (userId, publicationId) => {
    // return User.updateOne({ _id: userId }, { $push: { publications: publicationId } });
    const user = User.findById(userId);

    user.publications.push(publicationId);
    await user.save();

    return user;
};
