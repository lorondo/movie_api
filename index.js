const express = require('express');
    morgan = require('morgan');

const app = express();

app.use(morgan('common'));

let topMovies = [
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

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.get('/', (req, res) => {
    res.send('Welcome to my favorite movie app!');
});

app.use('express.static('documentation.html'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});