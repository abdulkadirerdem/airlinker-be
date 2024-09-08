const { register, login, me } = require("../controllers/authentication");
const passport = require("passport");
const { authentication, random } = require("../helpers");
const { updateUserById } = require("../services/user-services");
const nacl = require("tweetnacl");
const bs58 = require("bs58");
const jwt = require("jsonwebtoken");

module.exports = (router) => {
  router.post("/auth/register", register);
  router.post("/auth/login", login);
  router.get("/auth/me", me);

  router.get("/wallet-login/request-message", (req, res) => {
    const message = `Login request: ${Date.now()}`;
    res.json({ message });
  });

  // İmzayı doğrula ve token oluştur
  router.post("/wallet-login/verify", (req, res) => {
    const { publicKey, signature, message } = req.body;

    // signature ve publicKey'in string ve base64 olduğundan emin olun
    if (typeof signature !== "string" || typeof publicKey !== "string") {
      return res
        .status(400)
        .json({ message: "Geçersiz signature veya publicKey formatı." });
    }

    try {
      const decodedSignature = new Uint8Array(Buffer.from(signature, "base64")); // Base64'ten Uint8Array'e
      const decodedMessage = new TextEncoder().encode(message);
      const decodedPublicKey = bs58.default.decode(publicKey); // Base58'ten Uint8Array'e

      const isValid = nacl.sign.detached.verify(
        decodedMessage,
        decodedSignature,
        decodedPublicKey
      );

      if (isValid) {
        const token = jwt.sign({ publicKey }, "secret-key", {
          expiresIn: "1h",
        });
        res.json({ token });
      } else {
        res.status(401).json({ message: "İmza doğrulama başarısız." });
      }
    } catch (error) {
      console.error("Decoding error:", error);
      return res
        .status(400)
        .json({ message: "Decoding error. Geçersiz format." });
    }
  });

  // Google Authentication Routes
  router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "https://localhost:8083/",
    }),
    async (req, res) => {
      const user = req.user;
      const salt = random();

      const sessionToken = authentication(salt, user._id.toString());

      await updateUserById(user._id, {
        "authentication.sessionToken": sessionToken,
      });

      res.cookie("COOKIE-KEY", sessionToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });

      res.redirect("http://localhost:8083/dashboard");
    }
  );

  router.get("/auth/logout", (req, res) => {
    req.logout(async () => {
      await res.clearCookie("COOKIE-KEY", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      await res.clearCookie("connect.sid", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.redirect("http://localhost:8083/auth/login");
    });
  });
};
