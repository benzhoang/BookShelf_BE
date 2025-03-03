const express = require("express");
const router = express.Router();
const LocationController = require("../controllers/location.controller");

const {
    authenticate,
    authorizeAdmin,
    authorizeCustomer,
    authorizeManager,
    authorizeStaff,
} = require("../middlewares/auth.middleware");

router.get("/", LocationController.getAllLocation);
router.post("/",authenticate, authorizeAdmin, LocationController.createLocation);
router.get("/:id", LocationController.getLocationById);
router.delete("/:id",authenticate, authorizeAdmin, LocationController.deleteLocation);


module.exports = router;
