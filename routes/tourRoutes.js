const express = require("express");
const {
  getAllTours,
  createTour,
  updateTour,
  getTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = require("../controllers/tourController");
const formatQuery = require("../middleware/formatQuery");
const router = express.Router();

router.route("/top-tours").get(aliasTopTours, getAllTours);

router.route("/tour-stats").get(getTourStats);
router.route("/monthly-plan").get(getMonthlyPlan);
router.route("/").get(formatQuery, getAllTours).post(createTour);

router.route("/:id").get(getTour).delete(deleteTour).patch(updateTour);

module.exports = router;
