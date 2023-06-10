"use strict";

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const passportConfig = require("./config/passport.config");
const authRouter = require('./routes/auth.router');

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

/* routes */
app.use('/api', authRouter);


app.get("/guess", (req, res) => {
  const n = Math.floor(Math.random() * 100);
  res.send(String(n));
});


const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}/`);
});
