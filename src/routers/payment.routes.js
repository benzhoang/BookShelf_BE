const express = require("express");
const router = express.Router();
const PaymentController = require("../controllers/payment.controller");

const {
    authenticate,
    authorizeAdmin,
    authorizeCustomer,
    authorizeManager,
    authorizeStaff,
} = require("../middlewares/auth.middleware");

router.get("/", PaymentController.getAllPayment);
router.post("/", authorizeAdmin, PaymentController.createPayment);
router.get("/:id", PaymentController.getPaymentById);
router.delete("/:id", authorizeAdmin, PaymentController.deletePayment);

module.exports = router;
