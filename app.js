const express = require('express');
const { getTopics } = require('./controllers/topics.controllers');

const app = express();

app.use(express.json());

app.use((err, req, res, next) => {
    console.log(err);
});

app.get('/api/topics', getTopics);

module.exports = app;