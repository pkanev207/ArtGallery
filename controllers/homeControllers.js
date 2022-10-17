const router = require('express').Router();

const Publication = require('../models/Publication');
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
    const user = await userService.getOne(req.user._id).lean();
    // const userPublications = Publication.find({ author: user._id });
    // console.log(userPublications);

    res.render('home/profile', { ...user });
});

module.exports = router;
