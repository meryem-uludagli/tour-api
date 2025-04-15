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
const { protect } = require("../controllers/authController");
const router = express.Router();

router.route("/top-tours").get(aliasTopTours, getAllTours);

router.route("/tour-stats").get(protect, getTourStats);
router.route("/monthly-plan").get(protect, getMonthlyPlan);
router
  .route("/")
  .get(protect, formatQuery, getAllTours)
  .post(protect, createTour);

router
  .route("/:id")
  .get(getTour)
  .delete(protect, deleteTour)
  .patch(protect, updateTour);

module.exports = router;
