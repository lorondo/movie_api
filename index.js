const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movies;
const Users = require('./models.js');

mongoose.connect('mongodb://localhost:27017/dbname',
    { useNewUrlParser: true, useUnifiedTopology: true

    });

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

app.post('/users', (req, res) => {]
    await Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + 'already exists');
            } else {
                Users
                    .create({
                        Username: req.body.Username,
                        Password: req.body.Password, 
                        Email: req.body.Email,
                        Birthday: req.body.Birthday
                    })
                    .then((user) =>{res.status(201).json(user) })
                .catch((error) => {
                    console.error(error);
                    res.status(500).send('Error: ' + error);
                })
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

// Update the username of a User

app.put('/users/:username', async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username}, 
        { $set:
        {
          Username: req.body.Username,
          Password: req.body.Password, 
          Email: req.body.Email,
          Birthday: req.body.Birthday  
        }
    },
    { new: true}) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    })
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

// Get all users
app.get('/users', async (req, res) => {
    await Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Get a user by username
app.get('/users/:Username', async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username},
        {
            $push: { FavoriteMovies: req.params.MovieID }
        },
        { new: true }) //This line makes sure that the updated document is returned
        .then((updatedUser) => {
            res.json(updatedUser):
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Delete a user by username
app.delete('/users/:Username', async (req, res) => {
    await Users.findOneAndRemove({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found.');
            } else {
                res.status(200).send(req.params.Username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});