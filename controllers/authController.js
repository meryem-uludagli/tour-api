const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const e = require("../utils/error");

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

exports.signUp = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    createSendToken(newUser, 201, res);
  } catch (error) {
    next(e(500, error.message));
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      next(e(400, "Lütfen mail ve şifrenizi giriniz"));
    }

    const user = await User.findOne({ email });

    if (!user) {
      next(e(400, "Girdiğiniz maile kayitli kullanici yok"));
    }

    const isValid = await user.correctPass(password, user.password);

    if (!isValid) {
      next(e(403, "Girdiğiniz şifre geçersiz"));
    }
    createSendToken(user, 200, res);
  } catch (error) {
    next(e(500, error.message));
  }
};

exports.logout = (req, res) => {
  res.clearCookie("jwt").status(200).json({ message: "oturumunuz kapatildi" });
};

exports.protect = async (req, res, next) => {
  // 1) client'tan gelen tokeni al
  let token = req.cookies.jwt || req.headers.authorization;

  // 1.2) token header olarak geldiyse bearer kelimesinden sonrasını al
  if (token && token.startsWith("Bearer")) {
    token = token.split(" ")[1];
  }

  // 1.3) token gelmediyse hata fırlat
  if (!token) {
    return next(e(403, "Bu işlem için yetkiniz yok (jwt gönderilmedi)"));
  }

  // 2) tokenin geçerliliğini doğrula (zaman aşımına uğradımı / imza doğru mu)
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.message === "jwt expired") {
      return next(e(403, "Oturumunuz süresi doldu (tekrar giriş yapın)"));
    }

    return next(e(403, "Gönderilen token geçersiz"));
  }

  // 3) token ile gelen kullanıcının hesabı duruyor mu
  let activeUser;

  try {
    activeUser = await User.findById(decoded.id);
  } catch (error) {
    return next(e(403, "Gönderilen token geçersiz"));
  }

  // 3.1) hesap silindiyse hata gönder
  if (!activeUser) {
    return next(e(403, "Kullanıcının hesabına erişilemiyor (tekrar kaydolun)"));
  }

  // 3.2) hesap dondurulduysa hata gönder
  if (!activeUser?.active) {
    return next(e(403, "Kullanıcının hesabı dondurulmuş"));
  }

  // 4) tokeni verdikten sonra şifresini değiştirmiş mi kontrol et
  if (activeUser?.passChangedAt && decoded.iat) {
    const passChangedSeconds = parseInt(
      activeUser.passChangedAt.getTime() / 1000
    );

    if (passChangedSeconds > decoded.iat) {
      return next(
        e(
          403,
          "Yakın zamanda şifrenizi değiştirdiriniz. Lütfen tekrar giriş yapın"
        )
      );
    }
  }

  // bu mw'den sonra çalışıcak olan bütün mw ve methodlara aktif kullanıcı verisini gönder
  req.user = activeUser;

  next();
};

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(404).json({ message: "Bu işlem için yetkiniz yok" });
    }
    next();
  };
