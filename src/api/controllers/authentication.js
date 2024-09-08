const {
  getUserByEmail,
  createUser,
  getUserById,
  getUserByWalletAddress,
} = require("../services/user-services");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required!" });
    }

    const user = await getUserByEmail(email, "+authentication.password");

    if (!user) {
      return res.status(400).json({ message: "No user found!" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.authentication.password
    );

    if (!isPasswordValid) {
      return res.status(403).json({ message: "Invalid password!" });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "36h",
    });

    return res.status(200).json({ message: "Login successful!", accessToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Alanların boş olup olmadığını kontrol et
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "Missing fields!" });
    }

    // Email formatını kontrol et
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Email format is invalid." });
    }

    // Şifre doğrulama (minimum 8 karakter, büyük ve küçük harf, rakam, özel karakter)
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      )
    ) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include a mix of uppercase, lowercase, numbers, and special characters.",
      });
    }

    // İsim doğrulama (sadece harfler)
    if (!/^[a-zA-Z]+$/.test(firstName) || !/^[a-zA-Z]+$/.test(lastName)) {
      return res.status(400).json({
        message: "First name and last name can only contain letters.",
      });
    }

    // Kullanıcı var mı kontrol et
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Yeni kullanıcıyı oluştur
    const user = await createUser({
      email,
      firstName,
      lastName,
      authentication: {
        password: hashedPassword,
      },
    });

    // Token oluştur
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "36h",
    });

    // Cookie'ye token ekle
    res.cookie("COOKIE-KEY", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600 * 1000 * 36, // 36 saat
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    return res.status(201).json({
      message: "User created successfully!",
      user,
      token, // Token'ı response ile döndür
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const me = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(403).json({ message: "No token provided!" });
    }

    const token = authHeader.split(" ")[1]; // "Bearer <token>" şeklinde olduğu varsayılarak
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user;
    if (decoded.publicKey && decoded.publicKey.length > 0) {
      user = await getUserByWalletAddress(decoded.publicKey);
    } else {
      user = await getUserById(decoded.id);
    }

    if (!user) {
      return res.status(403).json({ message: "User not found!" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.log("Error in me: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  register,
  login,
  me,
};
