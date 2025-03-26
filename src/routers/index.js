// IMPORT ROUTER *****************************************
const BookRouter = require("./book.routes");
const UserRouter = require("./user.routes");
const BookMediaRouter = require("./bookMedia.routes");
const ActorRouter = require("./actor.routes");
const AuthRouter = require("./auth.routes");
const UploadRouter = require("./upLoadImg.routes")
const CategoryRouter = require('./category.routes')
const InvoiceRouter = require('./invoice.routes')
const PaymentRouter = require('./payment.routes')
const InvoiceDetailsRouter = require('./invoiceDetails.routes')

const {
  authenticate,
  authorizeAdmin,
  authorizeStaff,
} = require("../middlewares/auth.middleware");

function Router(app) {
  // CALL API ROUTER
  app.use("/api/books", BookRouter);
  app.use("/api/users", UserRouter);
  app.use("/api/bookmedias", BookMediaRouter);
  app.use("/api/actors", ActorRouter);
  app.use("/api/auth", AuthRouter);
  app.use("/api/uploadImg", UploadRouter);
  app.use('/api/categories', CategoryRouter);
  app.use('/api/invoices', InvoiceRouter);
  app.use('/api/payments', PaymentRouter)
  app.use('/api/invoicedetails', InvoiceDetailsRouter)
  app.get("/vnpay-ipn", (req, res) => {
    console.log("IPN Received:", req.query);
    res.status(200).send("OK");
  });
}

module.exports = Router;
