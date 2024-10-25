const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/cfDB',
    { 
      useNewUrlParser: true, 
      useUnifiedTopology: true
    });

const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

app.use(bodyParser.json());

let auth = require('./auth')(app);
const passport = require('passport');

require('./passport');

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
app.post('/users', async (req, res) => {
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
app.get('/movies', passport.authenticate('jwt', { session: false}), async (req, res) => {
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

app.listen(8080, () => console.log("listening on 8080"))