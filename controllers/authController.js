const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const signToken = (user_id) => {
  return jwt.sign({ id: user_id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP,
  });
};

const createSendToken = (user, code, res) => {
  const token = signToken(user._id);
  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    // secure: true
  });
  user.password = undefined;
  res.status(code).json({ message: "oturum açildi", token, user });
};

exports.signUp = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    createSendToken(newUser, 201, res);
  } catch (error) {
    res.status(500).json({
      message: "Üzgünüz bir hata oluştu",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Lütfen mail ve şifrenizi giriniz" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Girdiğiniz maile kayitli kullanici yok" });
    }

    const isValid = await user.correctPass(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: "Girdiğiniz şifre geçersiz" });
    }
    createSendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({
      message: "Üzgünüz bir hata oluştu",
      error: error.message,
    });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("jwt").status(200).json({ message: "oturumunuz kapatildi" });
};

exports.protect = async (req, res, next) => {
  let token = req.cookies.jwt || req.header.authorization;
  if (token && token.startsWith("Bearer")) {
    token = token.split("")[1];
  }
  if (!token) {
    return res
      .status(403)
      .json({ message: "Bu islem icin yetkiniz yok(jwt gonderilmedi)" });
  }
  let decoded;
  try {
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.message === "jwt expired") {
      return res
        .status(403)
        .json({ message: "oturumunuz suresi doldu(tekrar giris yapin" });
    }
    return res.status(403).json({ message: "gonderilen token gecersiz" });
  }
  const activeUser = await User.findById(decoded.id);
  if (!activeUser) {
    return res
      .status(403)
      .json({ message: "kullanicinin hesabina erisilemiyor(tekkr kaydolun)" });
  }
  if (!activeUser.active) {
    return res
      .status(403)
      .json({ message: "kullanicinin hesabi dondurulmustur" });
  }
  if (activeUser.passChangedAt && decoded.iat) {
    const passChangedSeconds = parseInt(
      activeUser.passChangedAt.getTime() / 1000
    );
    if (passChangedSeconds > decoded.iat) {
      return res.status(403).json({
        message:
          "yakin zamanda sifrenizi degstrdiniz lutfen tekrar gris yapiniz",
      });
    }
  }
  next();
};
