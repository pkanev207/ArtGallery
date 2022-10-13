const router = require('express').Router();
const authService = require('../services/authService');
const { COOKIE_SESSION_NAME } = require('../constants');

router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await authService.login(username, password);
    const token = await authService.createToken(user);

    res.cookie(COOKIE_SESSION_NAME, token);
    res.redirect('/');
});

router.get('/register', (req, res) => {
    res.render('auth/register');
});

router.post('/register', async (req, res) => {
    const { password, repeatPassword, ...userData } = req.body;

    if (password !== repeatPassword) {
        return res.render('auth/register', { error: 'Password missmatch!' });
    }

    try {
        const createdUser = await authService.create({ password, ...userData });
        const token = await authService.createToken(createdUser);

        res.cookie(COOKIE_SESSION_NAME, token);
        res.redirect('/');
    } catch (error) {
        return res.render('auth/register', { error: 'db error' });
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie(COOKIE_SESSION_NAME);
    res.redirect('/');
});

module.exports = router;
