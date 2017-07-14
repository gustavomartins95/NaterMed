'use strict'

const service = require('../service/service'),
    httpStatus = require('http-status')

var controller = {
    // Registrar novo login/cartão
    register: function (req, res) {
        service.register(req.body, function (error, status, message) {
            res.status(status).json({ message: message })
        })
    }
}

module.exports = controller
