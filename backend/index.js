const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const config = require('./config/devConfig').dev;
const app = express();
const bodyParser = require('body-parser');

let allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.header('Access-Control-Allow-Credentials', "True");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
                
    next();
};

app.use(allowCrossDomain);

app.use(
    cors({
        origin: [
            'http://localhost:4200',
            'http://localhost:63342',
            'https://rastorc3v.github.io',
            'http://localhost:63342',
            'http://localhost:4200',
            'http://localhost:4100',
            'http://localhost:8080'
        ],
        credentials: true
    })
);

app.use(cookieParser(),
    bodyParser.urlencoded({ extended: true }));

require('./routes')(app);


app.listen(config.port, () => {
    console.log(`App running on port ${config.port}.`)
});

