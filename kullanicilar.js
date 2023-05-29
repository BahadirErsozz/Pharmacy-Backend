const pool = require("./db")
var md5 = require("md5");
const getKullanici = (request, response) => {
    // console.log(request.get('user_id'))
    if (request.get('user_id') && (request.get('yetki') === 'admin' || request.get('yetki') === 'yonetici')) {
        request.get('yetki') == 'admin' 
        ?
        queryString = "SELECT * FROM KULLANICILAR;"
        :
        queryString = `SELECT * FROM KULLANICILAR WHERE user_id='${request.get('user_id')}'`
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

const createKullanici = (request, response) => {
    // console.log(request.get('user_id'))
    if (request.get('user_id') && request.get('yetki') === 'admin') {
        queryString = `INSERT INTO KULLANICILAR VALUES('${request.body.user_id}', '${request.body.kullanici_adi}', '${md5(request.body.parola)}','${request.body.yetki}');`;
        pool.query(queryString, (error, results) => {
            if (error) {
                response.status(500).send(error)
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
const updateKullanici = (request, response) => {
    // console.log(request.get('user_id'))
    if (request.get('user_id') && request.get('yetki') === 'admin') {
        queryString =
            "UPDATE KULLANICILAR SET ";
        queryString += request.body.user_id ? " user_id='" + request.body.user_id + "'," : "";
        queryString += request.body.kullanici_adi ? " kullanici_adi='" + request.body.kullanici_adi + "'," : "";
        queryString += request.body.parola ? String(request.body.parola).length != 40 ? " parola='" + md5(request.body.parola) + "'," : " parola='" + request.body.parola + "'," : "";
        queryString += request.body.yetki ? " yetki='" + request.body.yetki + "'," : "";
        queryString = queryString.replace(/,+$/, '');
        queryString += " WHERE user_id='" + request.body.user_id + "';";
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

const deleteKullanici = (request, response) => {
    // console.log(request.get('user_id'))
    if (request.get('user_id') && request.get('yetki') === 'admin') {
    queryString =
        `DELETE FROM KULLANICILAR WHERE user_id='${request.body.user_id}';`;
    pool.query(queryString, (error, results) => {
        if (error) {
            response.status(500).send(error)
            return
        }
        response.status(200).json(results.rows);
        return;
    });
    }
    else{
        response.status(403).send("not logged in");
        return;
    }
};

module.exports = { getKullanici, updateKullanici, deleteKullanici, createKullanici };