const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500;


// Yay! Routes!
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/new-page', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});

app.get('/old-page', (req, res) => {
    // send the correct code 301 for permanent redirection, defaults to 302
    res.redirect(301, '/new-page');
});

// Route handlers "middleware" chain example

const one = (req, res, next) => {
    console.log('one');
    next();
};

const two = (req, res, next) => {
    console.log('two');
    next();
};

const three = (req, res) => {
    console.log('three');
    res.send('Finished!');
};

app.get('/chain-route', [one, two, three]);
// awesome!

// 404 - always keep this as the last route!
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));