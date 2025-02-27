const Invoice = require("../models/invoice.model");

exports.getAllInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.find();
    res.status(200).json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice)
      return res.status(404).json({ message: "Invoice not found" });
    res.status(200).json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getInvoiceByUserId = async (req, res) => {
    try {
      const invoice = await Invoice.find({userID: req.params.userID});
      if (!invoice)
        return res.status(404).json({ message: "Invoice not found" });
      res.status(200).json(invoice);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

exports.createInvoice = async (req, res) => {
  try {
    const { userID, paymentID, totalPrice } = req.body;

    const newInvoice = new Invoice({
      userID,
      paymentID,
      totalPrice
    });
    await newInvoice.save();
    res.status(201).json({
      message: "Create new invoice successfully",
      invoice: newInvoice,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteInvoice = async (req, res) => {
 try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found!!!" });
    } else {
      res.status(200).json({ message: "Delete invoice successfully!!!" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};