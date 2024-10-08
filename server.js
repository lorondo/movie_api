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
    'Genre': {'name':'Action/Adventure'}
},
{
    'Title':'Jurassic Park',
    'Director': {'Name':'Steven Spielberg'},
    'Genre': {'name':'Action/Adventure'}
},
{
    'Title':'The Shape of Water',
    'Director': {'Name':'Guillermo del Toro'},
    'Genre': {'name':'Drama/Fantasy'}
},
{
    'Title':'Hudson Hawk',
    'Director': {'Name':'Michael Lehmann'},
    'Genre': {'name':'Action/Adventure'}
},
{
    'Title':'Ocean\'s Eleven',
    'Director': {'Name':'Steven Soderbergh'},
    'Genre': {'name':'Crime/Thriller'}
},
{
    'Title':'Cloud Atlas',
    'Director': {'Name':'Lana Wachowski, Tom Tykwer, and Lilly Wachowski'},
    'Genre': {'name':'Drama/Mystery'}
},
{
    'Title':'Guardians of the Galaxy',
    'Director': {'Name':'James Gunn'},
    'Genre': {'name':'Action/Adventure'}
},
{
    'Title':'Batman Begins',
    'Director': {'Name':'Christopher Nolan'},
    'Genre': {'name':'Action/Crime'}
},
{
    'Title':'Beauty and the Beast',
    'Director': {'Name':'Gary Trousdale and Kirk Wise'},
    'Genre': {'name':'Animation/Fantasy'}
},
{
    'Title':'The Lord of the Rings: The Fellowship of the Ring',
    'Director': {'Name':'Peter Jackson'},
    'Genre': {'name':'Action/Adventure'}
}
];

// READ
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});



app.listen(8080, () => console.log("listening on 8080"))