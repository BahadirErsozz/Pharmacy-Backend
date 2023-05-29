const md5 = require("md5");
const pool = require("./db")

const getEczane = (request, response) => {
    // console.log(request.get('user_id'))
    if (request.get('user_id')) {
        queryString =
            request.get("yetki") == "admin"
                ? "SELECT * FROM ECZANE;"
                : "SELECT * FROM ECZANE WHERE yonetici_id='" +
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

const createEczane = (request, response) => {
    // console.log(request.get('user_id'))
    if (request.get('user_id')) {
        queryString = `INSERT INTO ECZANE VALUES(DEFAULT, '${request.body.isim}', '${request.body.adres}', '${request.body.yonetici_id}', '${request.body.telefon_no}', '${request.body.acilis_saati}', '${request.body.kapanis_saati}');\n`;
        queryString += `UPDATE KULLANICILAR SET yetki='yonetici' WHERE user_id='${request.body.yonetici_id}';`;
        pool.query(queryString, (error, results) => {
            if (error) {
                response.status(500).send(error)
                return
            }
            queryString2 = 'Select * From Eczane Order By eczane_id DESC;'
            pool.query(queryString2, (error, results2) => {
                if (error) {
                    response.status(500).send(queryString)
                    return
                }
                
                response.status(200).send(results2.rows[0]);
                return;
            });
            
        });
    }
    else {
        response.status(403).send("not logged in");
        return;
    }


};
const updateEczane = (request, response) => {
    // console.log(request.get('user_id'))
    if (request.get('user_id')) {
        queryString =
            "UPDATE ECZANE SET ";
        queryString += request.body.yonetici_id ? " yonetici_id='" + request.body.yonetici_id + "'," : "";
        queryString += request.body.isim ? " isim='" + request.body.isim + "'," : "";
        queryString += request.body.adres ? " adres='" + request.body.adres + "'," : "";
        queryString += request.body.acilis_saati ? " acilis_saati='" + request.body.acilis_saati + "'," : "";
        queryString += request.body.kapanis_saati ? " kapanis_saati='" + request.body.kapanis_saati + "'" : "";
        queryString = queryString.replace(/,+$/, '');
        queryString += " WHERE eczane_id='" + request.body.eczane_id + "';";
        pool.query(queryString, (error, results) => {
            if (error) {
                response.status(500).send(error)
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

const deleteEczane = (request, response) => {
    // console.log(request.get('user_id'))
    queryString =
        `DELETE FROM ECZANE WHERE eczane_id='${request.body.eczane_id}';`;
    pool.query(queryString, (error, results) => {
        if (error) {
            response.status(500).send(error)
            return
        }
        response.status(200).json(results.rows);
        return;
    });
};

module.exports = { getEczane, updateEczane, deleteEczane, createEczane };