var request = require('request');
var tvshowName;



console.log("The replier bot is starting!");

// Dependencies =========================
var Twit = require('twit');
var config = require('./config');

var T = new Twit(config);

//Setting up a user stream
var stream = T.stream('user');

//Anytime someone tweets me
stream.on('tweet', tweetEvent);

function tweetEvent(eventMsg) {
    // var fs = require('fs');
    // var json = JSON.stringify(eventMsg, null, 2);
    // fs.writeFile("tweet.json", json);

    var replyTo = eventMsg.in_reply_to_screen_name;
    var text = eventMsg.text;
    var fromUser = eventMsg.user.screen_name;
    //Method to remove @tvshows_bot from the text
    var tvshowName = text.slice(13, text.length);

    console.log(replyTo + ' ' + fromUser);

    console.log(tvshowName);

    if (replyTo === 'tvshows_bot') {
        var newTweet = '@' + fromUser + ', sorry we cant find ' + tvshowName;
        tweetIt(newTweet);
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

//initialize global vars
var showId;
var trailerId;
var tvshowName = "intersection";
//fetch show's id by it's title
request('http://api.themoviedb.org/3/search/tv?api_key=59bb3beb43a54e85495a400befbb2d3c&query=' + tvshowName,
  function(error, response, body){
      var tvData = JSON.parse(body);
      //console.log(movieData);
      var showId = tvData.results[0].id;
      console.log(showId);
});

//fetch show's youtube trailer
request('http://api.themoviedb.org/3/tv/' + showId + '/videos?api_key=59bb3beb43a54e85495a400befbb2d3c',
  function(error,response,body){
    console.log(body);
    var trailerData = JSON.parse(body);
    console.log(trailerData);
    var trailerId = trailerData.results[0].key;
    console.log(trailerId);
});

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
