require("dotenv").config();
const express = require("express");

const app = express();

app.use(express.json());

const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
const userHandlers = require("./userHandlers.js");

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

app.put("/api/movies/:id", movieHandlers.validateMovie, movieHandlers.updateMovie);

app.post("/api/movies", movieHandlers.validateMovie, movieHandlers.postMovie);

app.delete("/api/movies/:id", movieHandlers.deleteMovie)

app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);

app.put("/api/users/:id", userHandlers.validateUser, userHandlers.updateUser);

app.post("/api/users", userHandlers.validateUser, userHandlers.postUser);

app.delete("/api/users/:id", userHandlers.deleteUser)

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
