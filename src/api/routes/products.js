const {
  createNewProduct,
  updateExistingProduct,
  deleteExistingProduct,
  getOneProductById,
  getAllProductsByUserId,
} = require("../controllers/products");
const { isAuthenticated } = require("../middlewares");

module.exports = (router) => {
  router.post("/products/:id", isAuthenticated, createNewProduct);
  router.put("/products/:productId", isAuthenticated, updateExistingProduct);
  router.delete("/products/:productId", isAuthenticated, deleteExistingProduct);
  router.get("/product-by-id/:productId", isAuthenticated, getOneProductById);
  router.get("/products/:userId", isAuthenticated, getAllProductsByUserId);
};
