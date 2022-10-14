const router = require('express').Router();

const homeController = require('./controllers/homeControllers');
const authController = require('./controllers/authController');
const publicationController = require('./controllers/publicationController');

router.use(homeController);
router.use('/auth', authController);
router.use('/publications', publicationController);

module.exports = router;
