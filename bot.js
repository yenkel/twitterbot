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

    console.log(replyTo + ' ' + fromUser);

    if (replyTo === 'tvshows_bot') {
        var newTweet = '@' + fromUser + ', sorry it is still under construction ' + text;
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
