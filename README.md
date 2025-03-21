# Movie API

## Objective

The goal of this project is to build the **server-side** component of a "movies" web application. This web application will provide users with access to information about different movies, directors, and genres. Users will be able to sign up, update their personal information, and create a list of their favorite movies.

### The Tech Stack
- **MongoDB**: Database to store movie data and user information.
- **Express**: Web framework for building the RESTful API.
- **React**: Frontend framework (for the next achievement).
- **Node.js**: Runtime for executing JavaScript code on the server.

---

## Features

- **User Authentication**: Secure user login and registration with JWT-based authentication.
- **Movie Management**: Add movies to a user's favorite list and retrieve a list of all movies.
- **CRUD Operations**: Create, Read, Update, and Delete operations for movies and user data.

## Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (includes npm)
- [MongoDB](https://www.mongodb.com/try/download/community) (or use a MongoDB cloud service like MongoDB Atlas)

### Steps

1. **Clone the repository**:

   ```bash
   git clone https://github.com/lordhubble/movie_api.git
   cd movie_api

2. **Install dependencies**:
   npm install

3. **Create a .env file and add the following environment variables:**:
  CONNECTION_URI=mongodb://localhost:27017/movie_api   # MongoDB connection string
  JWT_SECRET=your_jwt_secret                          # JWT secret key (should match the one used in passport.js)
  PORT=8080                                           # Port for the API to run on (optional)

4. **Start the application:**:
  npm run dev

### API Endpoints

**Post /users**
Description: Register a new user.

Request Body:
{
  "Username": "john_doe",
  "Password": "password123",
  "Email": "johndoe@example.com",
  "Birthday": "1990-01-01"
}
Response: The created user object.

**Post /login**
Description: Log in a user and receive a JWT token.

Request Body:
{
  "Username": "john_doe",
  "Password": "password123"
}

Response: The user object and JWT token.
{
  "user": {
    "Username": "john_doe",
    "Email": "johndoe@example.com",
    "Birthday": "1990-01-01",
    "FavoriteMovies": []
  },
  "token": "your_jwt_token"
}

**Get /movies**
Description: Retrieve a list of all movies. Requires JWT authentication.
Response: List of all movies.

**POST /users/:Username/movies/:MovieID**
Description: Add a movie to a user's favorite list.
Response: The updated user object.

**DELETE /users/:Username/movies/:MovieID**
Description: Remove a movie from a user's favorite list.
Response: The updated user object.

**GET /users**
Description: Retrieve all users. (Admin endpoint)
Response: List of all users.

**DELETE /users/:Username**
Description: Delete a user by username.
Response: Success or error message.



