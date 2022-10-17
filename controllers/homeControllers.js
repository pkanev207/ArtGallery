const router = require('express').Router();

const publicationService = require('../services/publicationService');
const userService = require('../services/userService');

router.get('/', async (req, res) => {
    const publications = (await publicationService
        .getAll()
        .lean())
        .map(x => ({ ...x, shareCount: x.usersShared.length }));

    res.render('home', { publications });
});

router.get('/profile', async (req, res) => {
    const user = await userService
        .getOne(req.user._id)
        .populate('publications')
        .populate('shares')
        .lean();

    const publicationsTitles = user.publications.map(x => x.title).join(', ');
    const sharesTitles = user.shares.map(x => x.title).join(', ');

    res.render('home/profile', { ...user, publicationsTitles, sharesTitles });
});

module.exports = router;
