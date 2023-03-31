const express = require("express");
const bodyParser = require("body-parser")
const http = require('http');
const querystring = require('querystring');

let pred = {Value:0};

function sendData(sentence) {
    return new Promise((resolve, reject) => {
        var postData = querystring.stringify({ msg: sentence });

        var options = {
            hostname: 'localhost',
            port: 1500,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length
            }
        };

        let req = http.request(options, async function (res) {

            res.setEncoding('utf8');
            var body = [];

            res.on('data', function (chunk) {
                chunk = JSON.parse(chunk)['data'];
                body.push(chunk);
            });

            res.on('end', function () {
                console.log('No more data in response.');
                try {
                    body = JSON.parse(body);
                } catch(e) {
                    reject(e);
                }
                resolve(body);
            });
        });

        req.on('error', function (e) {
            console.log('Problem with request:', e.message);
        });
        
        req.write(postData);
        req.end();
    });
    
}


// New app using express module
const app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));

// view engine setup
app.set('views', (__dirname + '/public/views'));
app.set('view engine', 'ejs');
  
app.get("/", function(req, res) {
    console.log('user');
    res.render('index', {analysed_sentence:'Your input sentence will appear here once you analyse it', feeling:'Feeling ?', probability:'confidence'});
    //res.sendFile(__dirname + "/public");
});
  
app.post("/", async function(req, res) {
    var sentence = String(req.body.sentence);
    console.log(sentence);

    //receive prediction from server
    response = await sendData(sentence).then((data) => {
        const response = {
            probability: data
        };
    return response;
    });

    probability = response['probability'];
    feeling = "Positive :)";
    if (probability < 0.5){
        probability = 1 - probability;
        feeling = "Negative :(";
    }

    probability = probability.toFixed(2);

    res.render('index', {analysed_sentence:sentence,
                         feeling: feeling,  
                         probability:probability});
    
});
  
app.listen(3000, function(){
  console.log("server is running on port 3000");
})





