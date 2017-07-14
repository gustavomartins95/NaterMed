'use strict'

const mysql = require('mysql'),
    connection = mysql.createConnection({
        database: 'dbnatermed',
        host: 'localhost',
        user: 'root',
        password: ''
    })
connection.connect(function (err) {
    if (err) {
        console.error('Error Connecting: ' + err)
        return
    }
})

module.exports = connection
