const { selectTopics } = require('../models/topics.models');

exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((topics) => {
        if(topics.length === 0) {
            res.status(404).send({msg: 'not found'});
        } else {
            res.status(200).send({ topics });
        }
    })
    .catch((err) => {
        next(err);
    });
}