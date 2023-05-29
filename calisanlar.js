const pool = require("./db")

const getCalisan = (request, response) => {
    if (request.get('user_id')) {
        queryString =
            request.get("yetki") == "admin"
                ? "SELECT * FROM CALISANLAR as C, ECZANE as E WHERE E.eczane_id = C.eczane_id;"
                : "SELECT * FROM ECZANE as E, CALISANLAR as C WHERE E.eczane_id = C.eczane_id AND E.yonetici_id='" +
                request.get("user_id") +
                "';";
        pool.query(queryString, (error, results) => {
            if (error) {
                response.status(500)
                return
            }
            response.status(200).json(results.rows.map((val) => {
                val.ise_giris_tarihi = String(val.ise_giris_tarihi).substring(0, 15)
                return val
            }));
            return;
        });
    }
    else {
        response.status(403).send("not logged in");
        return;
    }
};

const createCalisan = (request, response) => {
    // console.log(request.get('user_id'))
    if (request.get('user_id')) {
        queryString = `INSERT INTO CALISANLAR VALUES('${request.body.pozisyon}', '${request.body.maas}', CURRENT_TIMESTAMP,'${request.body.eczane_id}','${request.body.tc_no}');`;
        pool.query(queryString, (error, results) => {
            if (error) {
                response.status(500).send(error)
                return
            }
            console.log(request.body)
            response.status(200).send('insert succesful');
            return;
        });
    }
    else {
        response.status(403).send("not logged in");
        return;
    }


};
const updateCalisan = (request, response) => {
    if (request.get('user_id')) {
        queryString =
            "UPDATE CALISANLAR SET ";
        queryString += request.body.pozisyon ? " pozisyon='" + request.body.pozisyon + "'," : "";
        queryString += request.body.maas ? " maas='" + request.body.maas + "'," : "";
        queryString += request.body.ise_giris_tarihi ? " ise_giris_tarihi='" + request.body.ise_giris_tarihi + "'," : "";
        queryString += request.body.eczane_id ? " eczane_id='" + request.body.eczane_id + "'," : "";
        queryString = queryString.replace(/,+$/, '');
        queryString += " WHERE tc_no='" + request.body.tc_no + "';";
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

const deleteCalisan = (request, response) => {
    queryString =
        `DELETE FROM CALISANLAR WHERE tc_no='${request.body.tc_no}';`;
    pool.query(queryString, (error, results) => {
        if (error) {
            response.status(500).send(error)
            return
        }
        response.status(200).json(results.rows);
        return;
    });
};

module.exports = { getCalisan, updateCalisan, deleteCalisan, createCalisan };