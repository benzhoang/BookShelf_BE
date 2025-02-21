// IMPORT ROUTER *****************************************
const BookRouter = require("./book.routes");
const UserRouter = require("./user.routes");
const BookMediaRouter = require("./bookMedia.routes");
const ActorRouter = require("./actor.routes");
const AuthRouter = require("./auth.routes");

const {
  authenticate,
  authorizeAdmin,
  authorizeStaff,
} = require("../middlewares/auth.middleware");

function Router(app) {
  // CALL API ROUTER
  app.use("/api/books", authenticate, authorizeAdmin, BookRouter);
  app.use("/api/users", UserRouter);
  app.use("/api/bookmedias", BookMediaRouter);
  app.use("/api/actors", authorizeAdmin, ActorRouter);
  app.use("/api/auth", AuthRouter);
}

module.exports = Router;
