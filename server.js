const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

app.use(bodyParser.json());

let users = [
  {
    id: 1,
    name: "Bob",
    favoriteMovies: [] 
  },
  {
    id: 2,
    name: "Mitch",
    favoriteMovies: ["Star Wars"] 
  }
];

let movies = [
  {
    'Title':'Raiders of the Lost Ark',
    'Director': {'Name':'Steven Spielberg'},
    'Genre': {'Name':'Action_Adventure'}
},
{
    'Title':'Jurassic Park',
    'Director': {'Name':'Steven Spielberg'},
    'Genre': {'Name':'Action_Adventure'}
},
{
    'Title':'The Shape of Water',
    'Director': {'Name':'Guillermo del Toro'},
    'Genre': {'Name':'Drama_Fantasy'}
},
{
    'Title':'Hudson Hawk',
    'Director': {'Name':'Michael Lehmann'},
    'Genre': {'Name':'Action_Adventure'}
},
{
    'Title':'Ocean\'s Eleven',
    'Director': {'Name':'Steven Soderbergh'},
    'Genre': {'Name':'Crime_Thriller'}
},
{
    'Title':'Cloud Atlas',
    'Director': {'Name':'Lana Wachowski, Tom Tykwer, and Lilly Wachowski'},
    'Genre': {'Name':'Drama_Mystery'}
},
{
    'Title':'Guardians of the Galaxy',
    'Director': {'Name':'James Gunn'},
    'Genre': {'Name':'Action_Adventure'}
},
{
    'Title':'Batman Begins',
    'Director': {'Name':'Christopher Nolan'},
    'Genre': {'Name':'Action_Crime'}
},
{
    'Title':'Beauty and the Beast',
    'Director': {'Name':'Gary Trousdale and Kirk Wise'},
    'Genre': {'Name':'Animation_Fantasy'}
},
{
    'Title':'The Lord of the Rings: The Fellowship of the Ring',
    'Director': {'Name':'Peter Jackson'},
    'Genre': {'Name':'Action_Adventure'}
}
];

//CREATE (add a new user)
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
  } else {
    res.status(400).send('users need names')
  }
})

//UPDATE (update user id)
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

 let user = users.find( user => user.id == id );

 if (user) {
  user.name = updatedUser.name;
  res.status(200).json(user);
 } else {
  res.status(400).send('users need names')
 }
})

//POST (user updates favorite movie list)
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

 let user = users.find( user => user.id == id );

 if (user) {
  user.favoriteMovies.push(movieTitle);
  res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
 } else {
  res.status(400).send('no such user')
 }
})

//DELETE (user removes movie from favorite movies list)
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

 let user = users.find( user => user.id == id );

 if (user) {
  user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
  res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
 } else {
  res.status(400).send('no such user')
 }
})

//DELETE (user can deregister)
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

 let user = users.find( user => user.id == id );

 if (user) {
  users = users.filter( user => user.id != id);
  res.status(200).send(`user ${id} has been deleted`);
 } else {
  res.status(400).send('no such user')
 }
})

// READ (get all movies)
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
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



app.listen(8080, () => console.log("listening on 8080"))