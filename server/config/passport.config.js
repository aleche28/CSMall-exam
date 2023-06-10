"use strict";

const LocalStrategy = require("passport-local");
const usersDAO = require("../dao/users.dao");

function passportConfig(passport) {
  passport.use(
    new LocalStrategy(async (username, password, callback) => {
      // verify function
      try {
        const user = await usersDAO.getUser(username, password);
        if (user.error) {
          // user not found or wrong password
          callback(null, false, { message: user.error });
        } else {
          // valid credentials
          callback(null, user);
        }
      } catch (err) {
        callback({ error: err.message });
      }
    })
  );

  passport.serializeUser((user, callback) => {
    callback(null, {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });
  });
  passport.deserializeUser((user, callback) => {
    callback(null, user);
  });
}

module.exports = passportConfig;
