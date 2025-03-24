const express = require("express");
const router = express.Router();
const InvoiceDetailsController = require("../controllers/invoiceDetails.controller")

const {
    authenticate,
    authorizeAdmin,
    authorizeCustomer,
    authorizeManager,
    authorizeStaff,
} = require("../middlewares/auth.middleware");

router.get("/", authenticate, authorizeAdmin, InvoiceDetailsController.getAllInvoiceDetails);
router.get("/:id", authenticate, authorizeAdmin, InvoiceDetailsController.getInvoiceDetailsById);
router.post("/", authenticate, authorizeCustomer, InvoiceDetailsController.createInvoiceDetails);
router.delete("/:id", authenticate, authorizeCustomer, InvoiceDetailsController.deleteInvoiceDetails);
router.put("/:id", authenticate, authorizeCustomer, InvoiceDetailsController.updateInvoiceDetails);

module.exports = router;
