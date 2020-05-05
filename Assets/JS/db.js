// Node dependencies
const mysql = require("mysql");

// Module export
const db = module.exports;

// Database and connection
// (be sure to insert your password)
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "!Babu601",
    database: "employeeTracker_db",
});
connection.connect(function (err) {
    if (err) throw err;
});

// Main application functions
db.getData = async function (query, params) {
    return new Promise((resolve) => {
        connection.query(query, params, (err, res) => {
            if (err) throw err;
            resolve(res);
        });
    });
};
db.putData = async function (query, params, type) {
    return new Promise((resolve) => {
        connection.query(query, params, function (err, res) {
            if (err) throw err;
            resolve(res);
        });
    });
};

// Inquirer prompts lists
db.listData = async function (query) {
    return new Promise((resolve) => {
        connection.query(query, function (err, res) {
            if (err) throw err;
            let listArray = res.map((item) => {
                let values = Object.values(item);
                let container = { name: values[1], value: values[0] };
                return container;
            });
            resolve(listArray);
        });
    });
};

// End conection
db.end = () => connection.end();
