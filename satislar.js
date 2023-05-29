const pool = require("./db");

const getSatis = (request, response) => {
  if (request.get("user_id")) {
    queryString =
      request.get("yetki") == "admin"
        ? "SELECT * FROM SATISLAR, ECZANE, URUN;"
        : "SELECT E.isim, U.urun_adı, S.satilma_tarihi, S.adet, E.isim FROM SATISLAR as S,ECZANE as E,URUN as U WHERE U.urun_id = S.urun_id AND E.eczane_id = S.eczane_id AND E.yonetici_id='" +
          request.get("user_id") +
          "';";
    pool.query(queryString, (error, results) => {
      if (error) {
        response.status(500).send({error, queryString});
        return;
      }
      response.status(200).json(
        results.rows.map((row, index) => {
          row.id = index;
          row.satilma_tarihi = String(row.satilma_tarihi).substring(0, 15)
          return row;
        })
      );
      return;
    });
  } else {
    response.status(403).send("not logged in");
    return;
  }
};

const createSatis = (request, response) => {
  if (request.get("user_id")) {
    queryString = `INSERT INTO SATISLAR VALUES(CURRENT_TIMESTAMP, '${request.body.eczane_id}', '${request.body.urun_id}', '${request.body.adet}');`;
    pool.query(queryString, (error, results) => {
      if (error) {
        response.status(500).send({ queryString, error });
        return;
      }

      response.status(200).send("insert succesful");
      return;
    });
  } else {
    response.status(403).send("not logged in");
    return;
  }
};
const updateSatis = (request, response) => {

  if (request.get("user_id")) {
    queryString = "UPDATE SATISLAR SET ";
    queryString += request.body.satilma_tarihi
      ? " satilma_tarihi='" + request.body.satilma_tarihi + "',"
      : "";
    queryString += request.body.adet
      ? " adet='" + request.body.adet + "',"
      : "";
    queryString = queryString.replace(/,+$/, "");
    queryString +=
      " WHERE eczane_id='" +
      request.body.eczane_id +
      "' AND urun_id='" +
      request.body.urun_id +
      "';";
    pool.query(queryString, (error, results) => {
      if (error) {
        response.status(500).send(queryString);
        return;
      }
      response.status(200).send("update successfull");
      return;
    });
  } else {
    response.status(403).send("not logged in");
    return;
  }
};

const deleteSatis = (request, response) => {

  queryString = `DELETE FROM SATISLAR WHERE eczane_id='${request.body.eczane_id}' AND urun_id='${request.body.urun_id}';`;
  pool.query(queryString, (error, results) => {
    if (error) {
      response.status(500).send(error);
      return;
    }
    response.status(200).json(results.rows);
    return;
  });
};

module.exports = { getSatis, updateSatis, deleteSatis, createSatis };
