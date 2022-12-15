const pool = require("./db")

const getStok = (request, response) => {
    // console.log(request.get('user_id'))
    if (request.get('user_id')) {
        
        queryString =request.get("yetki") == "admin"
                ? `SELECT E.isim, E.eczane_id, U.urun_adı, U.urun_id, S.adet FROM STOKLAR AS S, ECZANE AS E, URUN AS U WHERE S.urun_id=U.urun_id AND E.eczane_id = S.eczane_id ;`
                : `SELECT E.isim, E.eczane_id, U.urun_adı, U.urun_id, S.adet FROM STOKLAR AS S, ECZANE AS E, URUN AS U WHERE S.urun_id=U.urun_id AND E.yonetici_id = '${request.get('user_id')}' AND E.eczane_id = S.eczane_id ;`;

        pool.query(queryString, (error, results) => {
            if (error) {
                response.status(500).send(error)
                return
            }
            response.status(200).json(results.rows);
            return;
        });
    }
    else {
        response.status(403).send("not logged in");
        return;
    }
};

const createStok = (request, response) => {
    // console.log(request.get('user_id'))
    if (request.get('user_id')) {
        queryString = `INSERT INTO Stok VALUES(DEFAULT, '${request.body.isim}', '${request.body.adres}', '12339399300', '${request.body.telefon_no}', '${request.body.acilis_saati}', '${request.body.kapanis_saati}');`;
        pool.query(queryString, (error, results) => {
            if (error) {
                response.status(500).send(queryString)
                return
            }
            response.status(200).send('insert successful');
            return;
        });
    }
    else {
        response.status(403).send("not logged in");
        return;
    }


};
const updateStok = (request, response) => {
    // console.log(request.get('user_id'))
    if (request.get('user_id')) {
        queryString =
            "UPDATE Stok SET ";
        queryString += request.body.yonetici_id ? " yonetici_id='" + request.body.yonetici_id + "'," : "";
        queryString += request.body.isim ? " isim='" + request.body.isim + "'," : "";
        queryString += request.body.adres ? " adres='" + request.body.adres + "'," : "";
        queryString += request.body.acilis_saati ? " acilis_saati='" + request.body.acilis_saati + "'," : "";
        queryString += request.body.kapanis_saati ? " kapanis_saati='" + request.body.kapanis_saati + "'" : "";
        queryString = queryString.replace(/,+$/, '');
        queryString += " WHERE Stok_id='" + request.body.Stok_id + "';";
        pool.query(queryString, (error, results) => {
            if (error) {
                response.status(500).send(queryString)
                return
            }
            response.status(200).send('update successfull');
            return;
        });
    }
    else {
        response.status(403).send("not logged in");
        return;
    }


};

const deleteStok = (request, response) => {
    // console.log(request.get('user_id'))
    queryString =
        `DELETE FROM Stok WHERE Stok_id='${request.body.Stok_id}';`;
    pool.query(queryString, (error, results) => {
        if (error) {
            response.status(500).send(error)
            return
        }
        response.status(200).json(results.rows);
        return;
    });
};

module.exports = { getStok: getStok, updateStok, deleteStok, createStok };