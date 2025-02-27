const express = require("express");
const router = express.Router();
const InvoiceController = require("../controllers/invoice.controller");

const {
    authenticate,
    authorizeAdmin,
    authorizeCustomer,
    authorizeManager,
    authorizeStaff,
} = require("../middlewares/auth.middleware");

router.get("/", authorizeAdmin, InvoiceController.getAllInvoice);
router.post("/", authorizeCustomer, InvoiceController.createInvoice);
router.get("/:id", InvoiceController.getInvoiceById);
router.delete("/:id", authorizeAdmin, InvoiceController.deleteInvoice);


module.exports = router;
