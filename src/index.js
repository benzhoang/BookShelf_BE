const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Swagger Setup
const setupSwagger = require("./configs/swagger.config");

// Import Routers
const BookRouter = require("./routers/book.routes");
const UserRouter = require("./routers/user.routes");
const BookMediaRouter = require("./routers/bookMedia.routes");
const ActorRouter = require("./routers/actor.routes");

const db = require("./configs/db.config");
db.connect();


app.use(bodyParser.json());
app.use(morgan("dev"));


app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Back-end project!!!" });
});

// Setup Swagger Documentation
setupSwagger(app);

// Setup Routers
app.use("/api/books", BookRouter);
app.use("/api/users", UserRouter);
app.use("/api/bookMedias", BookMediaRouter);
app.use("/api/actors", ActorRouter);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
