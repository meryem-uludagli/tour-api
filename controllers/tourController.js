const mongoose = require("mongoose");
const Tour = require("../models/tourModel.js");

exports.getAllTours = async (req, res) => {
  try {
    const tourQuery = Tour.find(req.formattedQery);
    if (req.query.sort) {
      tourQuery.sort(req.query.sort.split(",").join(""));
    } else {
      tourQuery.sort("-createdAt");
    }

    if (req.query.fields) {
      tourQuery.select(req.query.fields.replaceAll(",", ""));
    }

    tourQuery.skip(9).limit(3);

    const tours = await tourQuery;
    res.json({
      message: "getAllTours başarili",
      message: "getAllTours basarili",
      results: tours.length,
      tours,
    });
  } catch (error) {
    res.staus(404).json({ text: "getAllTours Başarisiz!!!" });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.json({ text: "createTour başarili", tour: newTour });
  } catch (error) {
    res
      .staus(404)
      .json({ text: "createTour Başarisiz!!!", error: error.message });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.json({ text: "getTour basarili" }, tour);
  } catch (error) {
    res.status(400).json({ text: "getTour basarisiz", error: error.message });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.deleteOne(req.params.id);
    res.status(204).json({});
  } catch (error) {
    res.status(400).json({ text: "deleteTour basarisiz" });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body);
    res.json({ text: "updateTour basarili" }, tour);
  } catch (error) {
    res.status(400).json({ text: "update basarisiz" });
  }
};
