const { getAllUsers, deleteUser, updateUser } = require("../controllers/users");
const { isAuthenticated, isOwner } = require("../middlewares");

module.exports = (router) => {
  router.get("/users", isAuthenticated, getAllUsers);
  router.delete("/users/:id", isAuthenticated, isOwner, deleteUser);
  router.patch("/users/:id", isAuthenticated, isOwner, updateUser);
};
