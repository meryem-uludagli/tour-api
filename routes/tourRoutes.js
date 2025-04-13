const express = require("express");
const {
  getAllTours,
  createTour,
  updateTour,
  getTour,
  deleteTour,
} = require("../controllers/tourController");
const formatQuery = require("../middleware/formatQuery");
const router = express.Router();

router.route("/").get(formatQuery, getAllTours).post(createTour);

router.route("/:id").get(getTour).delete(deleteTour).patch(updateTour);

module.exports = router;
