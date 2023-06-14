"use strict";

const db = require("../db/db");
const crypto = require("crypto");

exports.getUser = (username, password) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE username=?";
    db.get(sql, [username], (err, row) => {
      if (err) reject(err);

      if (!row) {
        resolve({ error: "User not found" }); // the user does not exist
      } else {
        crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) {
          if (err) reject(err);
          const isCorrect = crypto.timingSafeEqual(
            Buffer.from(row.hash, "hex"),
            hashedPassword
          );
          if (isCorrect) {
            // the user exists and the provided password is correct
            const user = { ...row };
            delete user.salt;
            delete user.hash;
            resolve(user);
          } else {
            // the user exists but the provided password is wrong
            resolve({ error: "Incorrect password" });
          }
        });
      }
    });
  });
};

exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE id=?";
    db.get(sql, [id], (err, row) => {
      if (err) reject(err);

      if (!row) {
        resolve({ error: "User not found" });
      } else {
        // By default, the local strategy looks for "username":
        const user = { id: row.id, username: row.username, email: row.email, role: row.role };
        resolve(user);
      }
    });
  });
};

exports.createUser = (username, email, password) => {
  return new Promise((resolve, reject) => {
    const role = "User"; // at the moment the role is hardcoded just to create some admin/users
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(password, salt, 32, function (err, hashedPassword) {
      if (err) reject(err);

      const sql =
        "INSERT INTO users (username, email, hash, salt, role) VALUES (?, ?, ?, ?, ?)";
      db.run(
        sql,
        [username, email, hashedPassword, salt, role],
        function (err) {
          if (err) {
            if (err.code === "SQLITE_CONSTRAINT")
              resolve({ error: "User already registered" });
            else reject(err);
          } else {
            resolve({ username, email, role });
          }
        }
      );
    });
  });
};

exports.getAllUsers = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users";
    db.all(sql, (err, rows) => {
      if (err) reject(err);

      const users = rows.map((r) => r.username);
      resolve(users);
    });
  });
};