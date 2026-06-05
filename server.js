import express from 'express';
import session from 'express-session';
import flash from './src/middleware/flash.js';
import { fileURLToPath } from 'url';
import path from 'path';
import { testConnection } from './src/models/db.js';
import router from './src/routes.js';

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'development-secret';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* -------------------------------------------------------------------------- */
/* Session Configuration                                                      */
/* -------------------------------------------------------------------------- */

app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 60 * 60 * 1000
        }
    })
);

/* -------------------------------------------------------------------------- */
/* Flash Messages                                                             */
/* -------------------------------------------------------------------------- */

app.use(flash);

/* -------------------------------------------------------------------------- */
/* Request Parsing                                                            */
/* -------------------------------------------------------------------------- */

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* -------------------------------------------------------------------------- */
/* Static Files                                                               */
/* -------------------------------------------------------------------------- */

app.use(express.static(path.join(__dirname, 'public')));

/* -------------------------------------------------------------------------- */
/* View Engine                                                                */
/* -------------------------------------------------------------------------- */

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

/* -------------------------------------------------------------------------- */
/* Global Template Variables                                                  */
/* -------------------------------------------------------------------------- */

app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    next();
});

/* -------------------------------------------------------------------------- */
/* Development Logging                                                        */
/* -------------------------------------------------------------------------- */

app.use((req, res, next) => {

    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }

    next();
});

/* -------------------------------------------------------------------------- */
/* Routes                                                                     */
/* -------------------------------------------------------------------------- */

app.use(router);

/* -------------------------------------------------------------------------- */
/* 404 Handler                                                                */
/* -------------------------------------------------------------------------- */

app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

/* -------------------------------------------------------------------------- */
/* Global Error Handler                                                       */
/* -------------------------------------------------------------------------- */

app.use((err, req, res, next) => {

    console.error('Error Occurred:', err.message);
    console.error(err.stack);

    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';

    res.status(status).render(`errors/${template}`, {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: err.stack
    });

});

/* -------------------------------------------------------------------------- */
/* Server Startup                                                             */
/* -------------------------------------------------------------------------- */

app.listen(PORT, async () => {

    try {

        await testConnection();

        console.log(`Server running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);

    } catch (error) {

        console.error('Database connection failed:', error);

    }

});