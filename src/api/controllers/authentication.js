const { getUserByEmail, createUser } = require("../services/user-services");
const { random, authentication } = require("../helpers");
const { getUserBySessionToken } = require("../services/user-services");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.statusMessage = "Email and password is needed!";
      return res.sendStatus(400);
    }

    const user = await getUserByEmail(
      email,
      "+authentication.salt +authentication.password"
    );

    if (!user) {
      res.statusMessage = "There is no user.!";
      return res.sendStatus(400);
    }

    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication.password !== expectedHash) {
      res.statusMessage = "Password is not matching. Try Again!";
      return res.sendStatus(403);
    }
    const salt = random();

    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    await user.save();

    res.cookie("COOKIE-KEY", user.authentication.sessionToken, {
      httpOnly: false, // JavaScript ile okunamaz, XSS saldırılarına karşı korur
      secure: process.env.NODE_ENV === "production", // Sadece HTTPS üzerinde gönderilir
      maxAge: 24 * 60 * 60 * 1000, // Cookie ömrü (ms cinsinden)
      sameSite: "strict", // CSRF saldırılarına karşı korur
    });

    res.statusMessage = "Login succesful!";
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

const register = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      res.statusMessage = "Email, password and user name is needed!";
      return res.sendStatus(400);
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      res.statusMessage = "This user already created.";
      return res.sendStatus(400);
    }

    const salt = random();

    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    res.statusMessage = "User succesfully created!";
    return res.status(201).json(user);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

const me = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const sessionToken = authHeader && authHeader.split(" ")[1]; // Extract token from Bearer scheme

    if (!sessionToken) {
      return res.sendStatus(403);
    }

    const user = await getUserBySessionToken(sessionToken);

    if (!user) {
      return res.sendStatus(403);
    }

    res.status(200).json({ user: user[0] });
  } catch (error) {
    console.log("Error from me: ", error);
    res.sendStatus(500);
  }
};

module.exports = {
  register,
  login,
  me,
};
