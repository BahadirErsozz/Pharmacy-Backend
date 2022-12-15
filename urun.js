const pool = require("./db")

const getUrun = (request, response) => {
    // console.log(request.get('user_id'))
    if (request.get('user_id')) {
        queryString ="SELECT * FROM Urun;";
                
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

const createUrun = (request, response) => {
    // console.log(request.get('user_id'))
    if (request.get('user_id')) {
        queryString = `INSERT INTO Urun VALUES(DEFAULT, '${request.body.urun_turu}', '${request.body.urun_adı}');`;
        pool.query(queryString, (error, results) => {
            if (error) {
                response.status(500).send(queryString)
                return
            }
            queryString2 = 'Select * From URUN Order By urun_id DESC;'
            pool.query(queryString2, (error, results2) => {
                if (error) {
                    response.status(500).send(queryString2)
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
const updateUrun = (request, response) => {
    // console.log(request.get('user_id'))
    if (request.get('user_id')) {
        queryString =
            "UPDATE Urun SET ";
        queryString += request.body.urun_turu ? " urun_turu='" + request.body.urun_turu + "'," : "";
        queryString += request.body.urun_adı ? " urun_adı='" + request.body.urun_adı + "'," : "";
        
        queryString = queryString.replace(/,+$/, '');
        queryString += " WHERE urun_id='" + request.body.urun_id + "';";
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

const deleteUrun = (request, response) => {
    // console.log(request.get('user_id'))
    queryString =
        `DELETE FROM urun WHERE urun_id='${request.body.urun_id}';`;
    pool.query(queryString, (error, results) => {
        if (error) {
            response.status(500).send(error)
            return
        }
        response.status(200).json(results.rows);
        return;
    });
};

module.exports = { getUrun: getUrun, updateUrun, deleteUrun, createUrun };