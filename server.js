const express = require('express');
const app = express();
const path = require('path');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');
const PORT = process.env.PORT || 3500;

// custom middleware logger - must use next
app.use(logger);

// You can make a whitelist of origins
// this would be the domains that you want to allow
// access to your server.
const whitelist = ['https://www.google.com', 'http://127.0.0.1:5500', 'http://localhost:3500'];
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
};

// cross origin resource sharing, this is good for public apis
app.use(cors());
// built-in middleware to handle urlencoded data
app.use(express.urlencoded({ extended: false }));
// built-in middleware for json
app.use(express.json());

// serve static files
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/subdir', express.static(path.join(__dirname, '/public')));


// routes
app.use('/', require('./routes/root'));
app.use('/subdir', require('./routes/subdir'));
app.use('/employees', require('./routes/api/employees'));


// 404 - always keep this as the last route!
app.all('/{*splat}', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } 
    else if (req.accepts('json')) {
        res.json({error: '404 Not Found'});
    } else {
        res.type('txt').send('404 Not Found');
    }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));