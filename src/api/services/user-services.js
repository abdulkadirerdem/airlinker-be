const { UserModel } = require("../models/users");

const getUsers = async (select = "") => {
  try {
    return await UserModel.find().select(select).exec();
  } catch (error) {
    console.log(error);
  }
};

const getUserByEmail = async (email, select = "") => {
  try {
    return await UserModel.findOne({ email }).select(select).exec();
  } catch (error) {
    console.log(error);
  }
};

const getUserById = async (id, select = "") => {
  try {
    const user = await UserModel.findById(id).select(select).exec();
    return user;
  } catch (error) {
    console.log(error);
  }
};

const getUserByWalletAddress = async (walletAddress, select = "") => {
  try {
    return await UserModel.findOne({ walletAddress }).select(select).exec();
  } catch (error) {
    console.log(error);
  }
};

const createUser = (values) =>
  new UserModel(values).save().then((user) => user.toObject());

const deleteUserById = (id) => UserModel.findByIdAndDelete(id);
const updateUserById = (id, values) => UserModel.findByIdAndUpdate(id, values);

module.exports = {
  getUsers,
  getUserByEmail,
  getUserById,
  createUser,
  deleteUserById,
  updateUserById,
  getUserByWalletAddress,
};
