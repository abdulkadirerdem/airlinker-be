const { ProductModel } = require("../models/product");

const createProduct = async (userId, productUrl, trackingStatus) => {
  try {
    const newProduct = await ProductModel.create({
      userId,
      productUrl,
      trackingStatus,
    });
    return newProduct;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

const updateProduct = async (productId, updatedFields) => {
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      updatedFields,
      {
        new: true,
        runValidators: true,
      }
    );
    return updatedProduct;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

const deleteProduct = async (productId) => {
  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(productId);
    return deletedProduct;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
const getProductById = async (id) => {
  try {
    const product = await ProductModel.findById(id);
    return product;
  } catch (error) {
    console.error(`Error while fetching product with id ${id}:`, error);
    throw error;
  }
};

const getProductsByUserId = async (userId) => {
  try {
    const products = await ProductModel.find({ userId });
    return products;
  } catch (error) {
    console.error(`Error while fetching products for userId ${userId}:`, error);
    throw error;
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getProductsByUserId,
};
