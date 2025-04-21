const multer = require("multer");
const User = require("../models/userModel");
const c = require("../utils/catchAsync");
const error = require("../utils/error");
const filterObject = require("../utils/filterObject");
const factory = require("./handlerFactory");
const sharp = require("sharp");

// diskStorage kurulum (dosyaları disk'e kaydetmeye yarayacak)
// const multerStorage = multer.diskStorage({
//   // dosyanın yükleneceği klasörü belirle
//   destination: function (req, file, cb) {
//     cb(null, "public/img/users");
//   },

//   // dosyanın ismi
//   filename: function (req, file, cb) {
//     // dosyanın uzantısını belirle
//     const ext = file.mimetype.split("/")[1];

//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Dosya tipi sadece resim olabilir (jpg,jpeg,png,webp..)"));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.resize = (req, res, next) => {
  if (!req.file) return next();

  const filename = `user-${req.user.id}-${Date.now()}.webp`;

  sharp(req.file.buffer)
    .resize(400, 400)
    .toFormat("webp")
    .webp({ quality: 70 })
    .toFile(`public/img/users/${filename}`);

  next();
};

exports.uploadUserPhoto = upload.single("avatar");

exports.updateMe = c(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(error(400, "Şifreyi bu endpoint ile güncelleyemezsiniz"));

  const filtredBody = filterObject(req.body, ["name", "email"]);

  if (req.file) filtredBody.photo = req.file.filename;

  const updated = await User.findByIdAndUpdate(req.user.id, filtredBody, {
    new: true,
  });

  res
    .status(200)
    .json({ message: "Bilgileriniz başarıyla güncellendi", updated });
});

exports.deleteMe = c(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(200).json({ message: "Hesabınız başarıyla kaldırıldı" });
});

exports.getAllUsers = factory.getAll(User);

exports.createUser = factory.createOne(User);

exports.getUser = factory.getOne(User);

exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);
