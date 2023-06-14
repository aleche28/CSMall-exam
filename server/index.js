"use strict";

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const passportConfig = require("./config/passport.config");
const authRouter = require('./routes/auth.router');
const pagesRouter = require('./routes/pages.router');
const blocksRouter = require('./routes/blocks.router');

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
app.use('/api', pagesRouter);
app.use('/api', blocksRouter);

/* enable static files handling */
app.use("/api/static", express.static("public"));

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}/`);
});
