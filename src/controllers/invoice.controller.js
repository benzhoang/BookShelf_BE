const Invoice = require("../models/invoice.model");
const InvoiceDetails = require("../models/invoiceDetails.model");
const Book = require("../models/book.model");

exports.getAllInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.find().populate({ path: 'userID', select: 'userName' });
    res.status(200).json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.status(200).json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getInvoiceByUserId = async (req, res) => {
  try {
    const invoice = await Invoice.find({ userID: req.params.userID });
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.status(200).json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// exports.createInvoice = async (req, res) => {
//   try {
//     const { userID, paymentID, totalPrice } = req.body;

//     const newInvoice = new Invoice({
//       userID,
//       paymentID,
//       totalPrice
//     });
//     await newInvoice.save();
//     res.status(201).json({
//       message: "Create new invoice successfully",
//       invoice: newInvoice,
//     });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

exports.createInvoice = async (req, res) => {
  try {
    const { paymentID, totalPrice, items } = req.body;
    const userID = req.userID;

    // Check quantity
    for (const item of items) {
      const book = await Book.findById(item.bookID);
      if (!book) {
        return res
          .status(404)
          .json({ message: `Sách không tồn tại: ${item.bookID}` });
      }
      if (book.quantity === 0) {
        return res
          .status(400)
          .json({ message: `Sách "${book.bookName}" đã hết hàng` });
      }
      if (book.quantity < item.quantity) {
        return res
          .status(400)
          .json({
            message: `Sách "${book.bookName}" chỉ còn ${book.quantity} cuốn`,
          });
      }
    }

    // Create invoice
    const newInvoice = new Invoice({
      userID,
      paymentID,
      totalPrice,
    });
    await newInvoice.save();

    const invoiceDetailsPromises = items.map(async (item) => {
      const newInvoiceDetail = new InvoiceDetails({
        invoiceID: newInvoice._id,
        bookID: item.bookID,
        quantity: item.quantity,
        price: item.price,
      });
      await newInvoiceDetail.save();

      await Book.findByIdAndUpdate(
        item.bookID,
        { $inc: { quantity: -item.quantity } },
        { new: true }
      );
    });

    await Promise.all(invoiceDetailsPromises);

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
