const pool = require("./db")

const getKisi = (request, response) => {
    // console.log(request.get('user_id'))
    if (request.get('user_id')) {
        queryString =
            request.get("yetki") == "admin"
                ? "SELECT * FROM KISILER;"
                : "SELECT K.tc_no, K.ad, K.soyad, K.adres FROM CALISANLAR AS C, ECZANE AS E, KISILER AS K WHERE K.tc_no = C.tc_no AND C.eczane_id = E.eczane_id AND E.yonetici_id='" +
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

const createKisi = (request, response) => {
    // console.log(request.get('user_id'))
    if (request.get('user_id')) {
        queryString = `INSERT INTO KISILER VALUES('${request.body.tc_no}', '${request.body.ad}',  '${request.body.soyad}', '${request.body.adres}');`;
        pool.query(queryString, (error, results) => {
            if (error) {
                response.status(500).send(error)
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
const updateKisi = (request, response) => {
    // console.log(request.get('user_id'))
    if (request.get('user_id')) {
        queryString =
            "UPDATE KISILER SET ";
        //queryString += request.body.tc_no ? " tc_no='" + request.body.tc_no + "'," : "";
        queryString += request.body.ad ? " ad='" + request.body.ad + "'," : "";
        queryString += request.body.soyad ? " soyad='" + request.body.soyad + "'," : "";
        queryString += request.body.adres ? " adres='" + request.body.adres + "'," : "";
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

const deleteKisi = (request, response) => {
    // console.log(request.get('user_id'))
    queryString =
        `DELETE FROM KISILER WHERE tc_no='${request.body.tc_no}';`;
    pool.query(queryString, (error, results) => {
        if (error) {
            response.status(500).send(error)
            return
        }
        response.status(200).json(results.rows);
        return;
    });
};

module.exports = { getKisi, updateKisi, deleteKisi, createKisi };