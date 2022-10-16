const router = require('express').Router();

const { isAuth } = require('../middleware/authMiddleware');
const { preloadPublication, isPublicationAuthor } = require('../middleware/publicationMiddleware');
const publicationService = require('../services/publicationService');
const { getErrorMessage } = require('../utils/errorMapper');

router.get('/', async (req, res) => {
    const publications = await publicationService.getAll().lean();
    res.render('publication', { publications });
});

router.get('/:publicationId/details', async (req, res) => {
    const publication = await publicationService.getOneDetailed(req.params.publicationId).lean();
    const isAuthor = publication.author._id == req.user?._id;
    res.render('publication/details', { ...publication, isAuthor });
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



router.get('/create', isAuth, (req, res) => {
    res.render('publication/create');
});

router.post('/create', isAuth, async (req, res) => {
    const publicationData = { ...req.body, author: req.user._id };
    try {
        await publicationService.create(publicationData);
        res.redirect('/publications');
    } catch (error) {
        res.render('publication/create', { ...req.body, error: getErrorMessage(error) });
    }
});

module.exports = router;
