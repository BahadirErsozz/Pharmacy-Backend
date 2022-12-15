const pool = require("./db")

const getSatis = (request, response) => {
    // console.log(request.get('user_id'))
    if (request.get('user_id')) {
        queryString =
            request.get("yetki") == "admin"
                ? "SELECT E.isim,U.urun_adı,S.satilma_tarihi  FROM SATISLAR as S,ECZANE as E,URUN as U WHERE U.urun_id = S.urun_id AND E.eczane_id = S.eczane_id;"
                : "SELECT E.isim,U.urun_adı,S.satilma_tarihi  FROM SATISLAR as S,ECZANE as E,URUN as U WHERE U.urun_id = S.urun_id AND E.eczane_id = S.eczane_id AND E.yonetici_id='" +
                request.get("user_id") +
                "';";
        pool.query(queryString, (error, results) => {
            if (error) {
                response.status(500)
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

const createSatis = (request, response) => {
    // console.log(request.get('user_id'))
    if (request.get('user_id')) {
        queryString = `INSERT INTO SATISLAR VALUES(DEFAULT, '${request.body.satilma_tarihi}', '${request.body.eczane_id}', '${request.body.urun_id}');`;
        pool.query(queryString, (error, results) => {
            if (error) {
                response.status(500).send(queryString)
                return
            }
            
                
            response.status(200).send('insert succesful');
            return;
            
            
        });
    }
    else {
        response.status(403).send("not logged in");
        return;
    }


};
const updateSatis = (request, response) => {
    // console.log(request.get('user_id'))
    if (request.get('user_id')) {
        queryString =
            "UPDATE SATISLAR SET ";
        queryString += request.body.satilma_tarihi ? " satilma_tarihi='" + request.body.satilma_tarihi + "'," : "";
        queryString = queryString.replace(/,+$/, '');
        queryString += " WHERE eczane_id='" + request.body.eczane_id + "' AND urun_id='" + request.body.urun_id + "';";
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

const deleteSatis = (request, response) => {
    // console.log(request.get('user_id'))
    queryString =
        `DELETE FROM SATISLAR WHERE eczane_id='${request.body.eczane_id}' AND urun_id='${request.body.urun_id}';`;
    pool.query(queryString, (error, results) => {
        if (error) {
            response.status(500).send(error)
            return
        }
        response.status(200).json(results.rows);
        return;
    });
};

module.exports = { getSatis, updateSatis, deleteSatis, createSatis };