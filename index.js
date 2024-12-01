const mongoose = require('mongoose');
const Models = require('./models.js');

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

//CREATE (add a new user)
//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/

app.get('/', (req, res) => {
  res.send('Welcome to my app!');
});

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

// //UPDATE (update user id)
// app.put('/users/:id', (req, res) => {
//   const { id } = req.params;
//   const updatedUser = req.body;

//  let user = Users.find( user => user.id == id );

//  if (user) {
//   user.name = updatedUser.name;
//   res.status(200).json(user);
//  } else {
//   res.status(400).send('users need names')
//  }
// })

/* POST login. */
// module.exports = (router) => {
//   router.post('/login', (req, res) => {
//     passport.authenticate('local', { session: false }, (error, user, info) => {
//       if (error || !user) {
//         return res.status(400).json({
//           message: 'Something is not right',
//           user: user
//         });
//       }
//       req.login(user, { session: false }, (error) => {
//         if (error) {
//           res.send(error);
//         }
//         let token = generateJWTToken(user.toJSON());
//         return res.json({ user, token });
//       });
//     })(req, res);
//   });
// }

// Login endpoint with additional checks
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
    const token = jwt.sign({ Username: user.Username }, process.env.JWT_SECRET, {
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

//POST (user updates favorite movie list)
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

 let user = Users.find( user => user.id == id );

 if (user) {
  user.favoriteMovies.push(movieTitle);
  res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
 } else {
  res.status(400).send('no such user')
 }
})

// //DELETE (user removes movie from favorite movies list)
// app.delete('/users/:id/:movieTitle', (req, res) => {
//   const { id, movieTitle } = req.params;

//  let user = Users.find( user => user.id == id );

//  if (user) {
//   user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
//   res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
//  } else {
//   res.status(400).send('no such user')
//  }
// })

// //DELETE (user can deregister)
// app.delete('/users/:id', (req, res) => {
//   const { id } = req.params;

//  let user = Users.find( user => user.id == id );

//  if (user) {
//   users = users.filter( user => user.id != id);
//   res.status(200).send(`user ${id} has been deleted`);
//  } else {
//   res.status(400).send('no such user')
//  }
// })

// READ (get all movies)
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

//READ (get movie, by title)
app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find( movie => movie.Title === title );

  if (movie){
    res.status(200).json(movie);
  } else {
    res.status(400).send('no such movie')
  }
});

//READ (get movies genre data, by genre)
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find( movie => movie.Genre.Name === genreName ).Genre;

  if (genre){
    res.status(200).json(genre);
  } else {
    res.status(400).send('no such genre')
  }
});

//READ (get director data, by director name)
app.get('/movies/directors/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find( movie => movie.Director.Name === directorName ).Director;

  if (director){
    res.status(200).json(director);
  } else {
    res.status(400).send('no such director')
  }
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

// Update a user's info, by username
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
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
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
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

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username},
      {
          $push: { FavoriteMovies: req.params.MovieID }
      },
      { new: true }) //This line makes sure that the updated document is returned
      .then((updatedUser) => {
          res.json(updatedUser);
      })
      .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
      });
});

// Delete a user by username
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
