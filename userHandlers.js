const database = require("./database.js");

const getUsers = (req, res) => {
  database.query("select * from users").then(([users]) => {
    res.json(users);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Couldn't retrieve data from DB");
  });
};

const getUserById = (req, res) => {
    const id = parseInt(req.params.id);

    database
        .query("select * from users where id = ?", [id])
        .then(([users]) => {
            users[0] != null
            ? res.json(users[0])
            : res.status(404).send("User was not found");
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Couldn't retrieve data from DB")
        });
};

module.exports = {
    getUsers,
    getUserById,
};
