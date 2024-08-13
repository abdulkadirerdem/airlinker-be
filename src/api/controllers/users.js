const {
  getUsers,
  deleteUserById,
  getUserById,
} = require("../services/user-services");

const getAllUsers = async (req, res) => {
  try {
    const users = await getUsers();

    res.statusMessage = "Users fetched!";
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error from get all users: ", error);
    res.statusMessage = "Users couldn't fetch!";
    return res.sendStatus(400);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteUserById(id);

    res.statusMessage = "User successfully deleted!";
    return res.json(deletedUser);
  } catch (error) {
    console.error("Error from deleting user: ", error);
    res.statusMessage = "User did not deleted!";
    return res.sendStatus(400);
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    if (!username) {
      res.statusMessage("Username is needed while updating user.!");
      res.sendStatus(400);
    }

    const user = await getUserById(id);

    user.username = username;
    await user.save();

    return res.status(200).json(user).end();
  } catch (error) {
    console.error("Error from update user: ", error);
    res.statusMessage("Error from update user.!");
    res.sendStatus(400);
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  updateUser,
};
