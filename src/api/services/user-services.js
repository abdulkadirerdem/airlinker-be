const { UserModel } = require("../models/Users");

const getUsers = async (select = "") => {
  try {
    const users = await UserModel.find().select(select).exec();
    return users;
  } catch (error) {
    console.log(error);
  }
};

const getUserByEmail = async (email, select = "") => {
  try {
    const user = await UserModel.findOne({ email }).select(select).exec();
    return user;
  } catch (error) {
    console.log(error);
  }
};

const getUserBySessionToken = async (sessionToken, select = "") => {
  try {
    let user = await UserModel.find({
      "authentication.sessionToken": sessionToken,
    })
      .select(select)
      .exec();

    if (!user) {
      user = await UserModel.find({
        "google.id": sessionToken,
      })
        .select(select)
        .exec();
    }

    return user;
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

const createUser = (values) =>
  new UserModel(values).save().then((user) => {
    user.toObject();
  });
const deleteUserById = (id) => UserModel.findByIdAndDelete({ _id: id });
const updateUserById = (id, values) => UserModel.findByIdAndUpdate(id, values);

module.exports = {
  getUsers,
  getUserByEmail,
  getUserBySessionToken,
  getUserById,
  createUser,
  deleteUserById,
  updateUserById,
};
