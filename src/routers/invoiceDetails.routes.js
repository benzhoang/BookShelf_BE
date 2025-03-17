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

router.get("/", authenticate, authorizeAdmin, InvoiceController.getAllInvoice);
router.post("/",authenticate, authorizeCustomer, InvoiceController.createInvoice);
router.get("/:id", InvoiceController.getInvoiceById);
router.delete("/:id",authenticate, authorizeAdmin, InvoiceController.deleteInvoice);


module.exports = router;
