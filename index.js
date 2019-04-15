// require('babel-register');
const http = require('http');
global.fetch = require('node-fetch');
var express = require("express");
var app = express();
const request = require('request');
var serveStatic = require('serve-static');
var unsplashKey = process.env.UNSPLASH_KEY

app.use(serveStatic(__dirname + "/dist"));

app.get("/getRandomPhoto", (req, res, next) => {
    var url = 'http://api.unsplash.com/photos/random?';
    var orientationQuery = req.query.orientation ? 'orientation=' + req.query.orientation + '&' : '';
    var countQuery = req.query.count ? 'count=' + req.query.count + '&' : '';
    var searchQuery = req.query.search ? 'query=' + req.query.search + '&' : '';
    var query =  orientationQuery + countQuery + searchQuery + 'client_id=' + unsplashKey;

    request({
        url: url + query
    }).on('error', function(e) {
        res.end(e);
    }).pipe(res);
});

app.get("/download", (req, res, next) => {
    var url = req.query.url  + '?client_id=' + unsplashKey;

    request({
        url: url
    }).on('error', function(e) {
        res.end(e);
    }).pipe(res);

})

const port = process.env.PORT || 4040;
app.listen(port, () => console.log(`Example app listening on port ${port}`));
