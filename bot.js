console.log("The replier bot is starting!");

// Dependencies =========================
var Twit = require('twit');
var config = require('./config');
var request = require('request');

var T = new Twit(config);

//Setting up a user stream
var stream = T.stream('user');

//Anytime someone tweets me
stream.on('tweet', tweetEvent);

//Global variables
var youtubeId;
var finalName;
var newTweet;
var tvshowName;
var showId;
var trailerId;
var replyTo;
var text;
var fromUser;
var movieOverview;

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}



function tweetEvent(eventMsg, youtubeId) {
    // var fs = require('fs');
    // var json = JSON.stringify(eventMsg, null, 2);
    // fs.writeFile("tweet.json", json);

    replyTo = eventMsg.in_reply_to_screen_name;
    text = eventMsg.text;
    fromUser = eventMsg.user.screen_name;

    //Method to remove @tvshows_bot from the text
    tvshowName = text.slice(13, text.length);

    //Method to replace spaces with + for the API
    finalName = tvshowName.replace(/ /g, "+");
    console.log(finalName);

    getId(finalName);

}

var sendTrailer = function(eventMsg, youtubeId, movieOverview) {

    if (replyTo == 'tvshows_bot') {
        if (trailerId !== 'JJzZNPy1yZU') {
            console.log("trailerId is ok");
            newTweet = '@' + fromUser + ' this is your ' + capitalizeFirstLetter(tvshowName) + " trailer, enjoy! " + 'https://www.youtube.com/watch?v=' + trailerId;
            tweetIt(newTweet);
        } else {
            newTweet = '@' + fromUser + ', sorry we cant find ' + capitalizeFirstLetter(tvshowName) + ". Please send us another TVshow name";
            tweetIt(newTweet);
        }

    }
}


function tweetIt(txt) {
    var tweet = {
        status: txt
    }
    T.post('statuses/update', tweet, tweeted);

    function tweeted(err, data, response) {
        if (err) {
            console.log("Something went wrong! ", err);
        } else {
            console.log("It worked!");
        }

    }

}

//fetch show's id by it's title
var getId = function(finalName) {
    request('http://api.themoviedb.org/3/search/tv?api_key=59bb3beb43a54e85495a400befbb2d3c&query=' + finalName,
        function(error, response, body) {
            var tvData = JSON.parse(body);
            if (tvData.results.length == 0) {
                console.log("im gonna search movie now")
                    // showId = '2288';
                getIdMovie(finalName);
            } else {
                showId = tvData.results[0].id;
                console.log("im show id", showId);
                getTrailer(showId);
            }
        });
}

//fetch show's youtube trailer
var getTrailer = function(showId) {

    request('http://api.themoviedb.org/3/tv/' + showId + '/videos?api_key=59bb3beb43a54e85495a400befbb2d3c',
        function(error, response, body) {
            console.log('http://api.themoviedb.org/3/tv/' + showId + '/videos?api_key=59bb3beb43a54e85495a400befbb2d3c');
            var trailerData = JSON.parse(body);
            if (trailerData.results.length > 0) {
                trailerId = trailerData.results[0].key;
                youtubeId = 'https://www.youtube.com/watch?v=' + trailerId;
                console.log(youtubeId);
                console.log("im user", fromUser);
                sendTrailer(fromUser);

            } else {
                trailerId = 'JJzZNPy1yZU';
                // console.log("we couldnt find " + finalName + " lets watch https://www.youtube.com/watch?v=" + trailerId);
                sendTrailer(fromUser);
            }
        });

}

//fetch movie's id by it's title
var getIdMovie = function(finalName) {
    request('http://api.themoviedb.org/3/search/movie?api_key=59bb3beb43a54e85495a400befbb2d3c&query=' + finalName,
        function(error, response, body) {
            console.log("im inside get id movie")
            var movieData = JSON.parse(body);
            if (movieData.results.length == 0) {
                showId = '2288';
            } else {
                showId = movieData.results[0].id;
                movieOverview = movieData.results[0].overview;
                console.log(movieOverview)
                console.log("im show id", showId);
                getTrailerMovie(showId, movieOverview);
            }
        });
}

//fetch movie's youtube trailer
var getTrailerMovie = function(showId, movieOverview) {

    request('http://api.themoviedb.org/3/movie/' + showId + '/videos?api_key=59bb3beb43a54e85495a400befbb2d3c',
        function(error, response, body) {
            //console.log('http://api.themoviedb.org/3/tv/' + showId + '/videos?api_key=59bb3beb43a54e85495a400befbb2d3c');
            var trailerDataMovie = JSON.parse(body);
            if (trailerDataMovie.results.length > 0) {
                trailerId = trailerDataMovie.results[0].key;
                youtubeId = 'https://www.youtube.com/watch?v=' + trailerId;
                console.log(youtubeId);
                console.log("im user", fromUser);
                sendTrailer(fromUser);

            } else {
                trailerId = 'JJzZNPy1yZU';
                // console.log("we couldnt find " + finalName + " lets watch https://www.youtube.com/watch?v=" + trailerId);
                sendTrailer(fromUser);
            }
        });

}


// // RETWEET BOT ==========================

// // find latest tweet according the query 'q' in params
// var retweet = function() {
//     var params = {
//         q: "@gabmimouni", // REQUIRED
//         result_type: 'recent',
//         lang: 'en'
//     }


//     Twitter.get('search/tweets', params, function(err, data) {
//         // if there no errors
//         if (!err) {
//             // grab ID of tweet to retweet
//             var retweetId = data.statuses[0].id_str;
//             // Tell TWITTER to retweet
//             Twitter.post('statuses/retweet/:id', {
//                 id: retweetId
//             }, function(err, response) {
//                 if (response) {
//                     console.log('Retweeted!!!');
//                 }
//                 // if there was an error while tweeting
//                 if (err) {
//                     console.log('Something went wrong while RETWEETING... Duplication maybe...');
//                 }
//             });
//         }
//         // if unable to Search a tweet
//         else {
//             console.log('Something went wrong while SEARCHING...');
//         }
//     });
// }

// // grab & retweet as soon as program is running...
// retweet();
// // retweet in every 5 minutes
// setInterval(retweet, 30000);
