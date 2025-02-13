const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

// CONFIG MONGODB
const db = require("./configs/db.config");
db.connect();

app.use(bodyParser.json());
app.use(morgan("dev"));

// IMPORT ROUTER *****************************************
const BookRouter = require("./routers/book.routes");
const UserRouter = require("./routers/user.routes");
const BookMediaRouter = require("./routers/bookMedia.routes");
const ActorRouter = require("./routers/actor.routes");
const AuthRouter = require("./routers/auth.routes");

// SETTUP SWAGGER
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");
const swaggerPath = path.join(__dirname, "swagger", "apiDocs.yaml");
const swaggerDocument = YAML.load(swaggerPath);

// SETUP GOOGLE ****************************************
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();
require("./configs/passport.config");

app.use(
  session({
    secret: [process.env.COOKIE_SECRET],
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }, // 1 day
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Back-end project!!!" });
});

// CALL API ROUTER
app.use("/api/books", BookRouter);
app.use("/api/users", UserRouter);
app.use("/api/bookmedias", BookMediaRouter);
app.use("/api/actors", ActorRouter);
app.use("/api/auth", AuthRouter);

app.get("/dashboard", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.json({ message: "Welcome to the dashboard!", user: req.user });
});

// SWAGGER API DOCS
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
