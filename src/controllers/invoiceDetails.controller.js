const InvoiceDetails = require("../models/invoiceDetails.model");

exports.getAllInvoiceDetails = async (req, res) => {
  try {
    const invoiceDetails = await InvoiceDetails.find();
    res.status(200).json(invoiceDetails);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getInvoiceDetailsById = async (req, res) => {
  try {
    const invoiceDetails = await InvoiceDetails.findById(req.params.id);
    if (!invoiceDetails)
      return res.status(404).json({ message: "Invoice Id not found!" });
    res.status(200).json(invoiceDetails);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createInvoiceDetails = async (req, res) => {
  try {
    const { invoiceID, bookID, quantity } = req.body;

    const newInvoiceDetail = new InvoiceDetails({
      invoiceID,
      bookID,
      quantity,
    });

    res.status(201).json({
      message: "Create invoice details successfully!",
      invoiceDetails: newInvoiceDetail,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateInvoiceDetails = async (req, res) => {
  try {
  } catch (error) {}
};

exports.deleteInvoiceDetails = async (req, res) => {
  try {
    const invoiceDetails = await InvoiceDetails.findByIdAndDelete(
      req.params.id
    );
    if (!invoiceDetails) return res.status(404).json({ message: "Not found!" });
    res.status(200).json({ message: "Delete successfully!!!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
