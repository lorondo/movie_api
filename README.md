# My Flix: Server-Side
# Overview
My Flix is a server-side API for a movie database, built with Node.js and Express. This API allows users to register, log in, view movies, and manage their favorite movie lists. Data is stored in a MongoDB database, with user authentication and authorization implemented using JWT and Passport.

# Project Goals
- Develop a RESTful API to manage a movie database.
- Enable users to create and manage their profiles.
- Secure the application with authentication and authorization mechanisms.
- Provide a scalable and flexible server-side solution.

# Key Features
- User Registration: New users can register with a unique username and password.
- User Authentication: Secure login with JWT.
- CRUD Operations: Full CRUD operations for user profiles and favorite movies.
- Data Retrieval: Search movies by title, genre, and director.

# Technical Requirements
- Node.js: Server-side JavaScript environment.
- Express.js: Framework for handling HTTP requests and routing.
- MongoDB: NoSQL database for data persistence.
- Mongoose: Object Data Modeling (ODM) for MongoDB and Node.js.
- Passport: Middleware for authentication.
- Express-Validator: Validation for incoming requests.
- JWT (JSON Web Token): Token-based user authentication.

# Endpoints
Users
- POST /users - Register a new user
- GET /users - Retrieve all users
- GET /users/:Username - Retrieve a specific user by username
- PUT /users/:Username - Update user information
- DELETE /users/:Username - Deregister an existing user

Movies
- GET /movies - Retrieve a list of all movies
- GET /movies/:title - Retrieve a specific movie by title
- GET /movies/genre/:genreName - Retrieve movies by genre
- GET /movies/directors/:directorName - Retrieve information about a director

Favorites
- POST /users/:Username/movies/:MovieID - Add a movie to a user's favorites
- DELETE /users/:Username/movies/:MovieID - Remove a movie from a user's favorites