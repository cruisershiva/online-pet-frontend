const snippetsRoute = require('./snippets');
const serviceRoute = require('./service');
const express = require('express');
const app = express();
const port = 3000;

// app.use('/', express.static(__dirname + '/'));
app.use('/', express.static(__dirname + '/webpage'));

app.use(express.json());

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/webpage/home.html");
});

app.post("/", function(req, res) {
    res.sendFile(__dirname + "/webpage/home.html");
    res.send("Success!!!");
});

app.use('/', snippetsRoute);
app.use('/service', serviceRoute);

app.listen(port, () => console.log("Server is running on http://localhost:" + port));