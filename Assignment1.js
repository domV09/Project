// Include http, express, and path
var http = require("http");
var express = require("express");
var path = require("path");

// constructs actual express object used for the project
var app = express();

// Path for product files
var FilesPath = path.resolve(__dirname, 'Files');
app.use(express.static(FilesPath));

// Gets the Home page "/" whcich is the "select.html"
app.get("/", function(request, response, next) {
    response.sendFile("select.html", {root: FilesPath}, function(err) {
    })
});

// Single method for all of the product pages
app.get("/select/:movies", function(request, response, next) {
    var moviefile = request.params.movies + ".html";
    response.sendFile(moviefile, {root: FilesPath});
});



// If reach here, request not handled by any previous gets, so send error page
app.use(function(request, response) {
    response.writeHead(404, {'Content-Type': 'text/html'});
    response.end('<html><body><h2>Sorry -- file not found!</h2></body></html>');
});

// If reach here, an unhandled error occurred somewhere previously
app.use(function(err, request, response, next) {
    console.log(err);
    response.writeHead(500, {'Content-Type': 'text/html'});
    response.end('<html><body><h2>Server error!</h2></body></html>');
});

http.createServer(app).listen(3000);


















