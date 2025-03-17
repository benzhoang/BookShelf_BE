
const InvoiceDetails = require("../models/invoiceDetails.model")

exports.getInvoiceDetails = async (req, res) => {
    try {
        const invoiceDetails = await InvoiceDetails.find();
        res.status(200).json(invoiceDetails)
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}