require('dotenv').config();
let express = require('express');
let app = express();
let bodyParser = require('body-parser');

console.log("Hello World");

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/public",express.static(__dirname + "/public"));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${req.ip}`);
    next();
});

app.route('/name')
  .get((req, res) => {
    const first = req.query.first;
    const last = req.query.last;
    res.json({name: `${first} ${last}`});
  })
  .post((req, res) => {
    const string = req.body.first + " " + req.body.last;
    res.json({ name: string });
  });

app.get("/:word/echo", (req, res) => {
    res.json({echo: req.params.word});
});

app.get('/now', (req, res, next) => {
    req.time = new Date().toString();
    next();
}, (req, res) => {
    res.json({time: req.time});
});

app.get("/json", (req, res) => {
    if (process.env.MESSAGE_STYLE === "uppercase") {
        res.json({"message": "HELLO JSON"});
    } else {
        res.json({"message": "Hello json"});
    }
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

module.exports = app;