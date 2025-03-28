const express = require("express");
const router = express.Router();
const InvoiceController = require("../controllers/invoice.controller");

const {
  authenticate,
  authorizeAdmin,
  authorizeCustomer,
  authorizeManager,
  authorizeStaff,
  authorizeManagerOrStaff
} = require("../middlewares/auth.middleware");

router.get("/", authenticate, authorizeAdmin, InvoiceController.getAllInvoice);
router.post(
  "/",
  authenticate,
  authorizeManagerOrStaff,
  InvoiceController.createInvoice
);

router.get("/:id", InvoiceController.getInvoiceById);

router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  InvoiceController.deleteInvoice
);

router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  InvoiceController.updateInvoice
);

router.get(
  "/user/:userID",
  authenticate,
  authorizeCustomer,
  InvoiceController.getInvoiceByUserId
);

module.exports = router;
