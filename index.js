const mongoose = require('mongoose');
const Models = require('./models.js');
const jwt = require('jsonwebtoken');

const Movies = Models.Movie;
const Users = Models.User;

const { check, validationResult } = require('express-validator');

// mongoose.connect('mongodb://localhost:27017/cfDB',
//     { 
//       useNewUrlParser: true, 
//       useUnifiedTopology: true
//     });

mongoose.connect( process.env.CONNECTION_URI,
    { 
      useNewUrlParser: true, 
      useUnifiedTopology: true
    });

const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

let auth = require('./auth')(app);
const passport = require('passport');

require('./passport');

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
  console.log('Listening on Port ' + port);
});

// GET Default page
app.get('/', (req, res) => {
  res.send('Welcome to my app!');
});

// POST Creating a new user
app.post('/users', 
  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], async (req, res) => {

    // check the validation objects for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

  let hashedPassword = Users.hashPassword(req.body.Password);
  await Users.findOne({ Username: req.body.Username }) // Search to see if a user with requested username already exists
    .then((user) => {
      if (user) {
        // If use is found, send a response that it already exists
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
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

// POST Login endpoint with additional checks
app.post('/login', async (req, res) => {
  const { Username, Password } = req.body;

  if (!Username || !Password) {
    return res.status(400).send('Username and Password are required');
  }

  try {
    // Find the user by username
    const user = await Users.findOne({ Username: Username });
    if (!user) {
      return res.status(401).send('User not found');
    }

    // Validate the password using a method like bcrypt
    const isValidPassword = user.validatePassword(Password);
    if (!isValidPassword) {
      return res.status(401).send('Invalid password');
    }

    // Generate a JWT token
    const token = jwt.sign({ Username: user.Username }, 'your_jwt_secret', {
      expiresIn: '7d', // Token expiration time
    });

    // Respond with the token and user data
    return res.status(200).json({
      message: 'Login successful',
      token: token,
      user: {
        Username: user.Username,
        Email: user.Email,
        Birthday: user.Birthday,
        FavoriteMovies: user.FavoriteMovies,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error: ' + error);
  }
});

// POST User updates favorite movie list
app.post('/users/:Username/movies/:MovieID', async (req, res) => {
  try {
    const query = { Username: { $regex: new RegExp(`^${req.params.Username}$`, 'i') } }; // Case-insensitive match

    // Find and update the user's favorite movies
    const updatedUser = await Users.findOneAndUpdate(
      query,
      { $push: { FavoriteMovies: req.params.MovieID } },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).send('User not found.');
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(500).send('Error: ' + err);
  }
});

// DELETE User removes movie from favorite movies list
app.delete('/users/:Username/movies/:MovieID', async (req, res) => {
  try {
    const query = { Username: { $regex: new RegExp(`^${req.params.Username}$`, 'i') } }; // Case-insensitive match

    // Find and update the user's favorite movies
    const updatedUser = await Users.findOneAndUpdate(
      query,
      { $pull: { FavoriteMovies: req.params.MovieID } },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).send('User not found.');
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(500).send('Error: ' + err);
  }
});

// READ Get all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//READ Get movie, by ID
app.get('/movies/:movieId', async (req, res) => {
  const { movieId } = req.params;
  await Movies.findById(movieId)
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//GET Get movie, by Title
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
          if (movie) {
              res.json(movie);
          } else {
              res.status(404).send(
                  'Movie with the title ' +
                      req.params.Title +
                      ' was not found.'
              );
          }
      })
      .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
      });
});

//GET Get movies genre data, by genre
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = Movies.find( movie => movie.Genre.Name === genreName ).Genre;

  if (genre){
    res.status(200).json(genre);
  } else {
    res.status(400).send('no such genre')
  }
});

//GET Get director data, by director name
app.get('/movies/directors/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = Movies.find( movie => movie.Director.Name === directorName ).Director;

  if (director){
    res.status(200).json(director);
  } else {
    res.status(400).send('no such director')
  }
});

// GET Get all users
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

// GET a user by username
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

// PUT Update a user's info, by username
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  // CONDITION TO CHECK ADDED HERE
  if(req.user.Username !== req.params.Username){
    return res.status(400).send('Permission denied');
  }
  // CONDITION ENDS
  await Users.findOneAndUpdate({ Username: req.params.Username }, { 
    $set:
    {
      Username: req.body.Username,
      Email: req.body.Email
    }
  },
  { new: true }) // This line makes sure that the updated document is returned
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  })

});

// DELETE a user by username
app.delete('/users/:Username', async (req, res) => {
  await Users.findOneAndDelete({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
