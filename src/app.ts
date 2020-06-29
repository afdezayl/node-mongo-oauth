import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import connectMongo from 'connect-mongo';

import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import morgan from 'morgan';
import path from 'path';
import expressHandlebars from 'express-handlebars';
import {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} from './views/helpers';

import firebase from 'firebase-admin';
import { connectDB } from './config/db';
import { router } from './routes';

// Load config
const config = dotenv.config();
dotenvExpand(config);

connectDB();

// Init app
const app = express();

// Parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session
const MongoStore = connectMongo(session);
const cookieName = process.env.SESSION_COOKIE_NAME || 'session';
const secret = process.env.SESSION_SECRET || 'abcd';
app.use(
  session({
    name: cookieName,
    cookie: { sameSite: 'strict', httpOnly: true },
    secret,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);


// Logger
if (process.env['NODE_ENV'] === 'development') {
  app.use(morgan('dev'));
}

// Firebase AUTH
const serviceAccount = require('../firebase-certs/firebase.json');
const fireApp = firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
});

// Template engine

app.set('views', './src/views');
app.engine(
  '.hbs',
  expressHandlebars({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
      formatDate: formatDate,
      stripTags: stripTags,
      truncate: truncate,
      editIcon: editIcon,
      select: select,
    },
  })
);
app.set('view engine', '.hbs');

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', router);

// Start listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
