const router = require('express').Router();

const homeController = require('./controllers/homeControllers');
const authController = require('./controllers/authController');

router.use(homeController);
router.use('/auth', authController);

module.exports = router;
