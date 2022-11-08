// Include http, express, handlebars, and path
var express = require("express");
var http = require("http");
var path = require("path");
var exphbs = require("express-handlebars");
const res = require("express/lib/response");

// Construct actual express object
var app = express();

// Set up handlebars
var handlebars = exphbs.create({ defaultLayout: 'main' });
app.engine('.handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static('views'));

// Home page "/"
app.get("/", function (request, response) {
    response.render("Home");
});

// Render the movie list
app.get("/movies", function (request, response) {
    const movieList = [
        {
            id: "MV289", name: "Rocky", description: "Movie about an italian boxer trying to make in Philidelphia.",
            price: 5.00, image: "Rocky.jpg"
        },
        {
            id: "MV135", name: "Avengers End Game", description: "A Team of superheroes trying to save the world.",
            price: 10.00, image: "Avengers.jpg"
        },
        {
            id: "MV561", name: "Fast Furious 9", description: "Dom Toretto and his team come against the most skilled driver who is  Dom's forsaken brother.",
            price: 15.00, image: "Fast9.jpg"
        }
    ];


    // Set Default value for id
    var previous = [];
    previous.id = ""; 

    response.render("movies", {movies: movieList,
                                errors: null,
                                previous: previous});
});

// Get the movies ID
app.get("/movieInfo", function (request, response, next) {
    request.id = request.query.id;
    next();
});

// Validate the ID
app.use("/movieInfo", function (request, response, next) {
    var errors = new Object(); // create a New (empty) object
    var valid = true; 
    const movieList = [
        {
            id: "MV289", name: "Rocky", description: "Movie about an italian boxer trying to make in Philidelphia.",
            price: 5.00, image: "Rocky.jpg"
        },
        {
            id: "MV135", name: "Avengers End Game", description: "A Team of superheroes trying to save the world.",
            price: 10.00, image: "Avengers.jpg"
        },
        {
            id: "MV561", name: "Fast Furious 9", description: "Dom Toretto and his team come against the most skilled driver who is  Dom's forsaken brother.",
            price: 15.00, image: "Fast9.jpg"
        }
    ];

    if (findMovieByID(movieList, 'id', request.id) === null) { // Make sure product is in the list
        errors.idDoesNotExist = true; 
        valid = false; // Error found
    }

    if (valid) {
        next(); // No errors continue to next
    }
    else {
        request.errorList = errors; // error found
        next(new Error("details")); // and follow error route
    }
});

// If error found reshow the form
app.use("/movieInfo", function (err, request, response, next) {
    if (err.message.includes("details")) {
        const movieList = [
            {
                id: "MV289", name: "Rocky", description: "Movie about an italian boxer trying to make in Philidelphia.",
                price: 5.00, image: "Rocky.jpg"
            },
            {
                id: "MV135", name: "Avengers End Game", description: "A Team of superheroes trying to save the world.",
                price: 10.00, image: "Avengers.jpg"
            },
            {
                id: "MV561", name: "Fast Furious 9", description: "Dom Toretto and his team come against the most skilled driver who is  Dom's forsaken brother.",
                price: 15.00, image: "Fast9.jpg"
            }
        ];

        // info to reshow
        var previous = [];

        // Echo back previous text values
        previous.id = request.id;

        response.render("movies", {movies: movieList, 
                                    errors: request.errorList,
                                    previous: previous}); // Pass errors to form
    }
    
});

// Search array function to get the object corresponding to ID
function findMovieByID(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return array[i];
        }
    }
    return null;
}

// Display info for requested id
app.get("/movieInfo", function (request, response, next) {
    const movieList = [
        {
            id: "MV289", name: "Rocky", description: "Movie about an italian boxer trying to make in Philidelphia.",
            price: 5.00, image: "Rocky.jpg"
        },
        {
            id: "MV135", name: "Avengers End Game", description: "A Team of superheroes trying to save the world.",
            price: 10.00, image: "Avengers.jpg"
        },
        {
            id: "MV561", name: "Fast Furious 9", description: "Dom Toretto and his team come against the most skilled driver who is  Dom's forsaken brother.",
            price: 15.00, image: "Fast9.jpg"
        }
    ];

    var requestedMovie = findMovieByID(movieList, 'id', request.id);

    response.render("movieInfo", {movie: requestedMovie});
});

// If reach here, request not handled by any previous gets, so send error page
app.use(function (request, response) {
    response.writeHead(404, { 'Content-Type': 'text/html' });
    response.end('<html><body><h2>Sorry -- file not found!</h2></body></html>');
});

// If reach here, an unhandled error occurred somewhere previously
app.use(function (err, request, response, next) {
    console.log(err);
    response.writeHead(500, { 'Content-Type': 'text/html' });
    response.end('<html><body><h2>Server error!</h2></body></html>');
});

http.createServer(app).listen(3000);
