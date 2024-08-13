const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getProductsByUserId,
} = require("../services/product-services");

const createNewProduct = async (req, res) => {
  const { id } = req.params;
  const { productUrl, trackingStatus } = req.body;
  try {
    const newProduct = await createProduct(id, productUrl, trackingStatus);

    res.statusMessage = "Product created!";
    return res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product: ", error);
    res.statusMessage = "Product couldn't be created!";
    return res.sendStatus(400);
  }
};

const updateExistingProduct = async (req, res) => {
  const { productId } = req.params;
  const updatedFields = req.body;
  try {
    const updatedProduct = await updateProduct(productId, updatedFields);

    if (!updatedProduct) {
      res.statusMessage = "Product not found!";
      return res.sendStatus(404);
    }

    res.statusMessage = "Product updated!";
    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product: ", error);
    res.statusMessage = "Product couldn't be updated!";
    return res.sendStatus(400);
  }
};

const deleteExistingProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const deletedProduct = await deleteProduct(productId);

    if (!deletedProduct) {
      res.statusMessage = "Product not found!";
      return res.sendStatus(404);
    }

    res.statusMessage = "Product deleted!";
    return res.status(200).json(deletedProduct);
  } catch (error) {
    console.error("Error deleting product: ", error);
    res.statusMessage = "Product couldn't be deleted!";
    return res.sendStatus(400);
  }
};

const getOneProductById = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await getProductById(productId);

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error while getting product by id: ", error);
    res.statusMessage = "Product couldn't be find!";
    return res.sendStatus(400);
  }
};

const getAllProductsByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const products = await getProductsByUserId(userId);

    return res.status(200).json(products);
  } catch (error) {
    console.error("Error while getting product by id: ", error);
    res.statusMessage = "Product couldn't be find!";
    return res.sendStatus(400);
  }
};

module.exports = {
  createNewProduct,
  updateExistingProduct,
  deleteExistingProduct,
  getOneProductById,
  getAllProductsByUserId,
};
