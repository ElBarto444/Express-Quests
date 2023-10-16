const database = require("./database.js");

const movies = [
  {
    id: 1,
    title: "Citizen Kane",
    director: "Orson Wells",
    year: "1941",
    colors: false,
    duration: 120,
  },
  {
    id: 2,
    title: "The Godfather",
    director: "Francis Ford Coppola",
    year: "1972",
    colors: true,
    duration: 180,
  },
  {
    id: 3,
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
    year: "1994",
    color: true,
    duration: 180,
  },
];

const getMovies = (req, res) => {
  database
    .query("select * from movies")
    .then(([movies]) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Couldn't retrieve data from DB");
    });
};

const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("select * from movies where id = ?", [id])
    .then(([movies]) => {
      movies[0] != null
        ? res.json(movies[0])
        : res.status(404).send("Movie was not found");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Couldn't retrieve data from DB");
    });
};

const postMovie = (req, res) => {
  const { title, director, year, color, duration } = req.body;

  database
    .query(
      "INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
      [title, director, year, color, duration]
    )
    .then(([result]) => {
      res.location(`/api/movies/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the movie");
    });
};

const updateMovie = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, director, year, color, duration } = req.body;

  database
    .query(
      "update movies set title = ?, director = ?, year = ?, color = ?, duration = ? where id = ?",
      [title, director, year, color, duration, id]
    )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Not Found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error editing the movie");
    });
};

const validateMovie = (req, res, next) => {
  const { title, director, year, color, duration } = req.body;
  const errors = [];
  const maxLength = 255;

  if (title == null) {
    errors.push({ field: "title", message: "This field is required" });
  } else if (director == null) {
    errors.push({ field: "director", message: "This field is required" });
  } else if (year == null) {
    errors.push({ field: "year", message: "This field is required" });
  } else if (color == null) {
    errors.push({ field: "color", message: "This field is required" });
  } else if (duration == null) {
    errors.push({ field: "duration", message: "This field is required" });
  } else if (title.length > maxLength) {
    errors.push({
      field: "title",
      message: "Field length cannot exceed 255 characters",
    });
  }

  if (errors.length) {
    res.status(422).json({ validationErrors: errors });
  } else {
    next();
  }
};

module.exports = {
  getMovies,
  getMovieById,
  postMovie,
  validateMovie,
  updateMovie,
};
