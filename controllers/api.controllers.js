const endpoints = require('../endpoints')

exports.getApi = (req, res, next) => {
    res.status(200).send(endpoints);
}