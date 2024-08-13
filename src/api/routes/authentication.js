const { register, login, me } = require("../controllers/authentication");

module.exports = (router) => {
  router.post("/auth/register", register);
  router.post("/auth/login", login);
  router.get("/auth/me", me);
};
