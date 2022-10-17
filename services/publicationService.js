const Publication = require('../models/Publication');
const User = require('../models/User');

exports.getAll = () => Publication.find();
exports.getOne = (publicationId) => Publication.findById(publicationId);
exports.getOneDetailed = (publicationId) => Publication.findById(publicationId).populate('author');
exports.update = (publicationId, publicationData) => {
    return Publication.updateOne(
        { _id: publicationId },
        { $set: publicationData },
        { runValidators: true }
    );
};
exports.delete = (publicationId) => Publication.deleteOne({ _id: publicationId });
exports.create = async (publicationData) => {
    const publication = await Publication.create(publicationData);
    const user = await User.findById(publication.author);

    await user.publications.push(publication._id);
};
