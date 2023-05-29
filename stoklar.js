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
            response.status(200).json(results.rows.map((row, index) => {row.id = index; return row;}));
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
        queryString = `INSERT INTO STOKLAR VALUES('${request.body.adet}', '${request.body.eczane_id}','${request.body.urun_id}');`;
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
            "UPDATE STOKLAR SET ";
        queryString += request.body.adet ? " adet='" + request.body.adet + "'," : "";
        queryString += request.body.eczane_id ? " eczane_id='" + request.body.eczane_id + "'," : "";
        queryString += request.body.urun_id ? " urun_id='" + request.body.urun_id + "'," : "";
        queryString = queryString.replace(/,+$/, '');
        queryString += " WHERE urun_id='" + request.body.urun_id + "' AND eczane_id='" + request.body.eczane_id + "';";
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
        `DELETE FROM STOKLAR WHERE urun_id='${request.body.urun_id}' AND eczane_id='${request.body.eczane_id}';`;
    pool.query(queryString, (error, results) => {
        if (error) {
            response.status(500).send(error)
            return
        }
        response.status(200).send('successfully deleted');
        return;
    });
};

module.exports = { getStok: getStok, updateStok, deleteStok, createStok };