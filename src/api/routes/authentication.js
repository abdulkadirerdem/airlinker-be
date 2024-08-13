const { register, login, me } = require("../controllers/authentication");
const passport = require("passport");
const { authentication, random } = require("../helpers");
const { updateUserById } = require("../services/user-services");

module.exports = (router) => {
  router.post("/auth/register", register);
  router.post("/auth/login", login);
  router.get("/auth/me", me);

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
      const user = req.user; // Passport tarafından oturum açmış kullanıcı
      const salt = random();

      // Google ile kimlik doğrulama yapıldığında sessionToken oluşturma
      const sessionToken = authentication(salt, user._id.toString());

      // Kullanıcı veritabanında sessionToken güncellemesi
      await updateUserById(user._id, {
        "authentication.sessionToken": sessionToken,
      });

      // `COOKIE-KEY` cookie'sini set etme
      res.cookie("COOKIE-KEY", sessionToken, {
        httpOnly: false, // JavaScript ile okunamaz, XSS saldırılarına karşı korur
        secure: process.env.NODE_ENV === "production", // Sadece HTTPS üzerinde gönderilir
        maxAge: 24 * 60 * 60 * 1000, // Cookie ömrü (ms cinsinden)
        sameSite: "strict", // CSRF saldırılarına karşı korur
      });

      res.redirect("http://localhost:8083/dashboard");
    }
  );

  router.get("/auth/logout", (req, res) => {
    req.logout(async () => {
      // COOKIE-KEY'i sil
      await res.clearCookie("COOKIE-KEY", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      // Passport'un oluşturduğu connect.sid cookie'sini de sil
      await res.clearCookie("connect.sid", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.redirect("http://localhost:8083/auth/login");
    });
  });
};
