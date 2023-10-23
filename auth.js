const argon2 = require("argon2");

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};

const hashPassword = (req, res, next) => {
  req.body.password
    ? argon2
        .hash(req.body.password, hashingOptions)
        .then((hashedPassword) => {
          req.body.hashedPassword = hashedPassword;
          delete req.body.password;

          next();
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Erreur 500 enculé");
        })
    : next();
};

module.exports = {
  hashPassword,
};
