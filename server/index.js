"use strict";

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const passportConfig = require("./config/passport.config");
const authRouter = require('./routes/auth.router');
const pagesRouter = require('./routes/pages.router');
const configsRouter = require('./routes/configs.router');

const app = express();
app.use(morgan("dev"));
app.use(express.json());

/* CORS setup */
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

/* session setup */
app.use(
  session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: false,
  })
);

/* passport setup */
passportConfig(passport);
app.use(passport.authenticate('session'));

/* enable static files handling */
app.use("/api/static", express.static("public"));

app.get("/api/images", (req, res) => {
  // the list of images is hardcoded. A real solution would be to use "fs" or some other
  // module to interact with the server file system
  const images = ["cat.jpg", "dog.jpg", "milan.jpg", "polito.jpeg", "rome.jpg", "turin.jpg",];
  res.json(images);
});

/* routes */
app.use('/api', configsRouter);
app.use('/api', authRouter);
app.use('/api', pagesRouter);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}/`);
});
