const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');

const app = express();

app.use(morgan('common'));

app.use(bodyParser.json());

let Movies = [
    {
        title: 'Raiders of the Lost Ark',
        director: 'Steven Spielberg'
    },
    {
        title: 'Jurassic Park',
        director: 'Steven Spielberg'
    },
    {
        title: 'The Shape of Water',
        director: 'Guillermo del Toro'
    },
    {
        title: 'Hudson Hawk',
        director: 'Michael Lehmann'
    },
    {
        title: 'Ocean\'s Eleven',
        director: 'Steven Soderbergh'
    },
    {
        title: 'Cloud Atlas',
        director: 'Lana Wachowski, Tom Tykwer, and Lilly Wachowski'
    },
    {
        title: 'Guardians of the Galaxy',
        director: 'James Gunn'
    },
    {
        title: 'Batman Begins',
        director: 'Christopher Nolan'
    },
    {
        title: 'Beauty and the Beast',
        director: 'Gary Trousdale and Kirk Wise'
    },
    {
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        director: 'Peter Jackson'
    }
];

// Gets the list of data about all movies

app.get('/movies', (req, res) => {
    res.send('Successful GET list of data about all movies');
});

// Gets the data about a single movie, by title

app.get('/movies/:title', (req, res) => {
    res.send('Successful GET data about a single movie, by title');
});

// Gets movie genre, by title

app.get('/movies/:title/:genre', (req, res) => {
    res.send('Successful GET movie genre, by title');
});

// Gets movie director, by title

app.get('/movies/:title/:director', (req, res) => {
    res.send('Successful GET movie director, by title');
});

// Adds data for a new user to our list of users

app.post('/users', (req, res) => {
    res.send('Successful POST update new user to user list');
});

// Update the username of a User

app.put('/users/:username', (req, res) => {
    res.send('Successful PUT user updates username');
});

// User adds movie to list of favorite movies

app.put('/users/:movies/:title', (req, res) => {
    res.send('Successful PUT user adds new movie to favorite movies list');
});

// User removes movie from list of favorite movies

app.delete('/users/:movies/:title', (req, res) => {
    res.send('Successful DELETE user removes movie from favorite movies list');
});

// User deregisters 

app.delete('/users/', (req, res) => {
    res.send('Successful DELETE user account');
});

app.get('/', (req, res) => {
    res.send('Welcome to my favorite movie app!');
});

app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});