const express = require("express");
var cors = require("cors");
const { Pool, Client } = require("pg");
var md5 = require("md5");
const sessions = require("express-session");
const { query } = require("express");
const { getEczane, updateEczane, deleteEczane, createEczane } = require("./eczane");
const { getUrun, updateUrun, deleteUrun, createUrun } = require("./urun");
const { getStok, updateStok, deleteStok, createStok } = require("./stoklar");
const { getKisi, updateKisi, deleteKisi, createKisi } = require("./kisiler");
const { getCalisan, createCalisan, updateCalisan, deleteCalisan } = require("./calisanlar");
const { getKullanici, createKullanici, updateKullanici, deleteKullanici } = require("./kullanicilar");
const { getSatis, createSatis, updateSatis, deleteSatis } = require("./satislar");

const app = express();
app.use(cors());
app.use(express.json());
app.use(
  sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    resave: true,
    saveUninitialized: true
  })
);

const pool = require("./db");


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
      `INSERT INTO KULLANICILAR VALUES('${request.body.user_id}', '${request.body.username}','${md5(request.body.password)}', NULL);
       INSERT INTO KISILER VALUES ('${request.body.user_id}', '${request.body.ad}','${request.body.soyad}', '${request.body.adres}');`,
      (error, results) => {
          if (error) {
              response.status(500).send("Error With the registeration:\n" + error);
          } else {
              login(request, response);
          }
      }
  );
};

const login = (req, res) => {
  pool.query(
    "SELECT user_id, yetki FROM kullanicilar WHERE kullanici_adi='" +
    req.body.username +
    "'" +
    " AND parola='" +
    md5(req.body.password) +
    "';",
    (error, results) => {
      if (error) {
        res.status(500).send("Error With the login:\n" + error);
        return
      } else if (results.rows.length == 0) {
        res.status(404).send("user was not found");
        return
      } else {
        if (req.session.user_id) {
          res.status(400).send("a user is already logged in");
          return;
        }
        req.session.user_id = results.rows[0].user_id;
        req.session.yetki = results.rows[0].yetki;
        res.status(200).send({
          "user_id": results.rows[0].user_id,
          "yetki": results.rows[0].yetki
        });
      }
    }
  );
};

const logout = (req, res) => {
  if (!req.get('user_id')) {
    res.status(400).send("nobody is logged in");
    return;
  }
  res.status(200).send("successfully logged out");
};
app.get("/getFromDB", getFromDB);

app.post("/register", register);
app.post("/login", login);
app.post("/logout", logout);

app.get("/eczane", getEczane);
app.post("/eczane", createEczane);
app.put("/eczane", updateEczane);
app.delete("/eczane", deleteEczane);

app.get("/urun", getUrun);
app.post("/urun", createUrun);
app.put("/urun", updateUrun);
app.delete("/urun", deleteUrun);

app.get("/stok", getStok);
app.post("/stok", createStok);
app.put("/stok", updateStok);
app.delete("/stok", deleteStok);

app.get("/kisi", getKisi);
app.post("/kisi", createKisi);
app.put("/kisi", updateKisi);
app.delete("/kisi", deleteKisi);

app.get("/calisan", getCalisan);
app.post("/calisan", createCalisan);
app.put("/calisan", updateCalisan);
app.delete("/calisan", deleteCalisan);

app.get("/kullanici", getKullanici);
app.post("/kullanici", createKullanici);
app.put("/kullanici", updateKullanici);
app.delete("/kullanici", deleteKullanici);

app.get("/satis", getSatis);
app.post("/satis", createSatis);
app.put("/satis", updateSatis);
app.delete("/satis", deleteSatis);

app.post("/user", (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

app.listen(8080, () => {
  console.log("test");
});
