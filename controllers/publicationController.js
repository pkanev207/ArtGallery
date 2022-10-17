const router = require('express').Router();

const { isAuth } = require('../middleware/authMiddleware');
const publicationService = require('../services/publicationService');
const userService = require('../services/userService');
const { preloadPublication, isPublicationAuthor } = require('../middleware/publicationMiddleware');
const { getErrorMessage } = require('../utils/errorMapper');

router.get('/', async (req, res) => {
    const publications = await publicationService.getAll().lean();

    res.render('publication', { publications });
});

router.get('/:publicationId/details', async (req, res) => {
    const publication = await publicationService.getOneDetailed(req.params.publicationId).lean();
    const isAuthor = publication.author._id == req.user?._id;
    const isShared = publication.usersShared.map(x => x.toString()).includes(req.user?._id);
    // console.log(publication.usersShared[0].toString());
    // const isShared = publication.usersShared.some(x => x._id == req.user._id);

    res.render('publication/details', { ...publication, isAuthor, isShared });
});


// router.use(isAuth); // defines public or private pages

router.get(
    '/:publicationId/edit',
    isAuth,
    preloadPublication,
    isPublicationAuthor,
    (req, res) => {
        // const publication = await publicationService.getOne(req.params.publicationId).lean();
        // if (publication.author != req.user._id) {
        //     return next({ message: 'You are not authorized!', status: 401 });
        // }
        res.render('publication/edit', { ...req.publication });
    });

router.post(
    '/:publicationId/edit',
    isAuth,
    preloadPublication,
    isPublicationAuthor,
    async (req, res) => {
        try {
            await publicationService.update(req.params.publicationId, req.body);
            res.redirect(`/publications/${req.params.publicationId}/details`);
        } catch (error) {
            res.render('publication/edit', { ...req.body, error: getErrorMessage(error) });
        }
    });

router.get(
    '/:publicationId/delete',
    isAuth,
    preloadPublication,
    async (req, res) => {
        await publicationService.delete(req.params.publicationId);

        res.redirect('/publications');
    }
);


router.get('/create', isAuth, (req, res) => {
    res.render('publication/create');
});

router.post('/create', isAuth, async (req, res) => {
    const publicationData = { ...req.body, author: req.user._id };

    try {
        const publication = await publicationService.create(publicationData);
        await userService.addPublication(req.user._id, publication._id);

        res.redirect('/publications');
    } catch (error) {
        res.render('publication/create', { ...req.body, error: getErrorMessage(error) });
    }
});

router.get('/:publicationId/share', isAuth, async (req, res) => {
    const publication = await publicationService.getOne(req.params.publicationId);
    const user = await userService.getOne(req.user._id);

    publication.usersShared.push(req.user._id);
    user.shares.push(publication);

    await publication.save();
    await user.save();

    res.redirect('/');
});

module.exports = router;
