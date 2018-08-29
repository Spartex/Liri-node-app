// Node module imports needed to run the functions
require("dotenv").config();

var request = require("request");
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var moment = require("moment");
var spotify = new Spotify(keys.spotify);
var fs = require("fs");
var chalk = require("chalk");
var args = process.argv.slice(2);
var command = args[0];
var userInput = args.slice(1).join(" ");




if (command === "spotify-this-song") {
	spotifyThis();
} else if (command === "movie-this") {
	movieThis();
}
else if (command === "concert-this") {
	concertThis();
}
else if (command === "do-what-it-says") {
	fileSaysDo();

} else {
	console.log("OOOPS! I don't understand . Please tell me a command: \nspotify-this-song \nmovie-this \nconcert-this  \ndo-what-it-says");
}


function spotifyThis() {
	if (!userInput) {
		userInput = "The Sign Ace of Base";
	}


	spotify.search({
		type: "track",
		query: userInput,
		limit: 1
	}, function (err, data) {
		if (err) {
			return console.log(err);
		} else {
			console.log("---------------------------------------------");
			console.log(chalk.cyan("Artist: " + data.tracks.items[0].album.artists[0].name)); // artist's name
			console.log(chalk.cyan("Song name: " + data.tracks.items[0].name)) // song name
			console.log(chalk.cyan("External url: " + data.tracks.items[0].album.external_urls.spotify)) // external link
			console.log(chalk.cyan("Album: " + data.tracks.items[0].album.name)) // album name
		}

		fs.appendFile("log.txt", "\nAppending this song and artist data: " +
			"\n" + data.tracks.items[0].album.artists[0].name +
			"\n" + data.tracks.items[0].name +
			"\n" + data.tracks.items[0].album.external_urls.spotify +
			"\n" + data.tracks.items[0].album.name, function (err) {
				if (err) {
					console.log(err);
				}
			})
	})
}

function movieThis() {
	if (userInput === null) {
		movieName = "Mr. Nobody";
	}


	var queryUrl = "http://www.omdbapi.com/?apikey=e146aa24&t=" + userInput + "&tomatoes=true&plot=short&r=json";

	request(queryUrl, function (err, response, body) {
		if (!err && response.statusCode === 200) {
			console.log("Everything is looking good!!");
		}

		console.log("---------------------------------------------");
		console.log(chalk.red("Movie Title: " + JSON.parse(body)["Title"]));
		console.log(chalk.red("Movie Release Date : " + JSON.parse(body)["Title"]));
		console.log(chalk.green("Movie Release Date : " + JSON.parse(body)["Year"]));
		console.log(chalk.green("Movie Rating : " + JSON.parse(body)["imdbRating"]));
		console.log(chalk.blue("Movie Rotten Tomato Rating : " + JSON.parse(body)["tomatoRating"]));
		console.log(chalk.blue("Movie was produced in : " + JSON.parse(body)["Country"]));
		console.log(chalk.hex("#DEADED").bold("Movie Language : " + JSON.parse(body)["Language"]));
		console.log(chalk.hex("#DEADED").bold("Movie Plot : " + JSON.parse(body)["Plot"]));
		console.log(chalk.hex("#DEADED").bold("Movie Actors : " + JSON.parse(body)["Actors"]));




		fs.appendFile("log.txt", "\n" + "Appending this movie information: " +
			"\n" + JSON.parse(body).Title + "\n" + JSON.parse(body).Year +
			"\n" + JSON.parse(body).imdbRating + "\n" + JSON.parse(body).tomatoRating +
			"\n" + JSON.parse(body).Country + "\n" + JSON.parse(body).Language +
			"\n" + JSON.parse(body).Plot + "\n" + JSON.parse(body).Actors, function (err) {
				if (err) {
					console.log(err);
				}
			})
	})
}



function concertThis() {
	var queryUrl = ("https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp");

	request(queryUrl, function (err, response, body) {
		if (!err && response.statusCode === 200) {
			console.log(JSON.parse(body));
		}

		console.log("---------------------------------------------");
		console.log(chalk.red("Band Name: " + (JSON.parse(body)[0].lineup)));
		console.log(chalk.red("Venue Name: " + (JSON.parse(body)[0].venue.name)));
		console.log(chalk.green("Venue City: " + (JSON.parse(body)[0].venue.city)));
		console.log(chalk.green(moment(JSON.parse(body)[0].datetime).format("dddd, MMMM Do YYYY, h:mm:ss a")));

	});
}

function fileSaysDo() {
	fs.readFile("random.txt", "utf8", function (error, data) {
		if (error) {
			return console.log(error);
		} else {
			var dataArr = data.split(",");
			userInput = dataArr[1];
			command = dataArr[0];

			if (command === "spotify-this-song") {
				spotifyThis();
			} if (command === "movie-this") {
				movieThis();
			}
			if (command === "concert-this") {
				concertThis();
			}
		}

		fs.appendFile("log.txt", "User has engaged the random file.", function (err) {
			if (err) {
				console.log(err);
			}
		})
	});
}
