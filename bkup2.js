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
var youtubeId;
var finalName;
var newTweet;
var tvshowName;
var replyTo;
var text;
var fromUser;
var eventMsg;

function tweetEvent(eventMsg) {
    // var fs = require('fs');
    // var json = JSON.stringify(eventMsg, null, 2);
    // fs.writeFile("tweet.json", json);

    var replyTo = eventMsg.in_reply_to_screen_name;
    var text = eventMsg.text;
    var fromUser = eventMsg.user.screen_name;

    //Method to remove @tvshows_bot from the text
    var tvshowName = text.slice(13, text.length);

    //Method to replace spaces with + for the API
    var finalName = tvshowName.replace(/ /g, "+");
    console.log(finalName);
    getId(finalName);
    // getTrailer();

    if (replyTo === 'tvshows_bot') {
        console.log(trailerId); //undefined
        if (!trailerId == undefined) {
            console.log("trailerId is ok");
            newTweet = '@' + fromUser + ' this is your trailer, enjoy!' + youtubeId;
            tweetIt(newTweet);
        } else {
            console.log("if theres no trailer"); //
            newTweet = '@' + fromUser + ', sorry we cant find ' + tvshowName;
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
            console.log("It worked! we found " + tvshowName);
        }

    }

}

//initialize global vars
var showId;
var trailerId;
//fetch show's id by it's title
var getId = function(finalName) {
    request('http://api.themoviedb.org/3/search/tv?api_key=59bb3beb43a54e85495a400befbb2d3c&query=' + finalName,
        function(error, response, body) {
            var tvData = JSON.parse(body);
            if (tvData.results.length == 0) {
                console.log("theres no such tv show");
                showId = '2288';
            } else {
                showId = tvData.results[0].id;
                console.log("im show id", showId);
                getTrailer(showId);
            }
        });
}

//fetch show's youtube trailer
var getTrailer = function(showId, finalName, eventMsg) {
    request('http://api.themoviedb.org/3/tv/' + showId + '/videos?api_key=59bb3beb43a54e85495a400befbb2d3c',
        function(error, response, body) {
            console.log('http://api.themoviedb.org/3/tv/' + showId + '/videos?api_key=59bb3beb43a54e85495a400befbb2d3c');
            var trailerData = JSON.parse(body);
            if (trailerData.results.length > 0) {
                trailerId = trailerData.results[0].key;
                youtubeId = 'https://www.youtube.com/watch?v=' + trailerId;
                console.log(youtubeId);
            } else {
                trailerId = 'JJzZNPy1yZU';
                console.log("we couldnt find ", finalName, "lets watch https://www.youtube.com/watch?v=", trailerId);
            }
            tweetEvent(eventMsg);
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
