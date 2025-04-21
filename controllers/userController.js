const c = require("../utils/catchAsync");

exports.updateMe = c(async (req, res, next) => {
  res.status(200).json("islem basarili");
});
exports.deleteMe = c(async (req, res, next) => {
  res.status(200).json("islem basarili");
});
exports.getAllUsers = c(async (req, res, next) => {
  res.status(200).json("islem basarili");
});
exports.createUser = c(async (req, res, next) => {
  res.status(200).json("islem basarili");
});
exports.getUser = c(async (req, res, next) => {
  res.status(200).json("islem basarili");
});
exports.updateUser = c(async (req, res, next) => {
  res.status(200).json("islem basarili");
});
exports.deleteUser = c(async (req, res, next) => {
  res.status(200).json("islem basarili");
});
