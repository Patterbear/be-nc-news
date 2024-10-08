const { selectTopics, insertTopic } = require('../models/topics.models');

exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((topics) => {
        res.status(200).send({topics});
    })
    .catch((err) => {
        next(err);
    });
}

exports.postTopic = (req, res, next) => {
    const newTopic = req.body;

    insertTopic(newTopic)
    .then((topic) => {
        res.status(201).send({topic})
    })
    .catch((err) => {
        next(err);
    }); 

}