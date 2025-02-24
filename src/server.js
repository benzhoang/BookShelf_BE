const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
const app = express();

const PORT = process.env.PORT;

<<<<<<< HEAD:src/index.js
const SERVER_URL = process.env.NODE_ENV === 'production'
  ? process.env.SERVER_URL_PROD
  : `http://localhost:${PORT}`;

const session = require("express-session");
const passport = require("passport");
=======
// IMPORT ROUTER
const Router = require("./routers/index");
>>>>>>> 917f88ffe5ea0f24e66a0f3e34ea1418312f66ea:src/server.js

// CONFIG MONGODB
const db = require("./configs/db.config");
db.connect();

app.use(bodyParser.json());
app.use(morgan("dev"));

// SETUP MIDDELEWARE
app.use(passport.initialize());

<<<<<<< HEAD:src/index.js
// IMPORT ROUTER *****************************************
const BookRouter = require("./routers/book.routes");
const CategoryRouter = require('./routers/category.routes')
const LocationRouter = require('./routers/location.routes')
const UserRouter = require("./routers/user.routes");
const RoleRouter = require('./routers/role.routes')
const BookMediaRouter = require("./routers/bookMedia.routes");
const ActorRouter = require("./routers/actor.routes");
const AuthRouter = require("./routers/auth.routes");
const UploadImg = require("./routers/upLoadImg.routes")

=======
>>>>>>> 917f88ffe5ea0f24e66a0f3e34ea1418312f66ea:src/server.js
// SETTUP SWAGGER
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");
const swaggerPath = path.join(__dirname, "swagger", "apiDocs.yaml");
const swaggerDocument = YAML.load(swaggerPath);
// Tự động cập nhật URL server theo môi trường
swaggerDocument.servers = [
  {
    url: SERVER_URL,
    description: "Server tự động nhận đường dẫn"
  }
];

// SETUP GOOGLE ****************************************

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

<<<<<<< HEAD:src/index.js
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Back-end project!!!" });
});

// CALL API ROUTER
app.use("/api/books", BookRouter);
app.use("/api/categories", CategoryRouter);
app.use("/api/locations", LocationRouter);
app.use("/api/users", UserRouter);
app.use("/api/roles", RoleRouter);
app.use("/api/bookmedias", BookMediaRouter);
app.use("/api/actors", ActorRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/uploadImg", UploadImg)

=======
>>>>>>> 917f88ffe5ea0f24e66a0f3e34ea1418312f66ea:src/server.js
app.get("/dashboard", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.json({ message: "Welcome to the dashboard!", user: req.user });
});

// ROUTER LINK
Router(app);

// SWAGGER API DOCS
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Back-end project!!!" });
});

app.listen(PORT, () => {
  console.log(`Server running on ${SERVER_URL}`);
  console.log(`Swagger docs available at ${SERVER_URL}/api-docs`);
});
