const express = require('express');
const hbs = require('express-handlebars');
const cookieParser = require('cookie-parser');

const { PORT } = require('./config/env');
const routes = require('./routes');
const { dbInit } = require('./config/db');
const { auth } = require('./middleware/authMiddleware');
const { errorHandler } = require('./middleware/errorHandlerMiddleware');

const app = express();

app.engine('hbs', hbs.engine({ extname: 'hbs' }));
app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(auth); // before routes and after cookieParser
app.use(routes);
app.use(errorHandler);

dbInit();

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
