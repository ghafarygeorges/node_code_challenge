// Third Party Packages
require("dotenv/config");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const { ValidationError } = require("express-validation");

// Imported Routes
const notesRoutes = require("./notes/notes-routes");
const categoriesRoutes = require("./categories/categories-routes");
const authRoutes = require("./auth/auth-routes");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer().array());

// Middleware to allow access to our APIs from different applications/ports
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Middleware to use the imported routes we created in our app
app.use("/notes", notesRoutes);
app.use("/categories", categoriesRoutes);
app.use("/auth", authRoutes);

// express error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof ValidationError) {
    res.status(400).send(error);
  } else {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).send({ message: message, data: data });
  }
});

// MongoDB connection using the mongoose package
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    console.log("Database connected");
  })
  .catch((err) => console.log(err));

app.listen(process.env.PORT);
console.log("Server started on port " + process.env.PORT);
