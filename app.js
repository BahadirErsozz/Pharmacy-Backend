const express = require("express");
var cors = require("cors");
const { Pool, Client } = require("pg");
var md5 = require("md5");

const app = express();
app.use(cors());

const pool = new Pool({
  user: "postgres",
  host: "127.0.0.1",
  database: "Proje",
  password: "1593574682b",
  port: 5432,
});

const getFromDB = (request, response) => {
  pool.query(
    "SELECT * FROM " + request.query.tableName + "",
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const register = (request, response) => {
  pool.query(
    "INSERT INTO KULLANICILAR VALUES('" +
      request.body.user_id +
      "', '" +
      request.body.username +
      "','" +
      md5(request.body.password) +
      "' );",
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const login = (request, response) => {
  pool
    .query(
      "SELECT parola FROM kullanicilar WHERE kullanici_adi='" +
        request.body.username +
        "'",
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(200).json(results.rows);
      }
    )
    .then((res) => {});
};
app.get("/getFromDB", getFromDB);

app.post("register", register);
app.post("login", login);
app.get("/Stok", (req, res) => {
  res.send("Test");
});
app.post("Kisi", (req, res) => {
  res.send("Test");
});
app.post("Kullanici", (req, res) => {
  res.send("Test");
});

app.listen(8080, () => {
  console.log("test");
});
