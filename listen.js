const app = require('./app');
const { PORT } = process.env;

app.listen(PORT, (err) => {
    if(err) {
        console.log(err);
    } else {
        console.log(`listening on port ${PORT}`);
    }
});