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
            //console.log('STATUS:', res.statusCode);
            //console.log('HEADERS:', JSON.stringify(res.headers));

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
  
app.get("/", function(req, res) {
    console.log('user');
  //res.sendFile(__dirname + "/public/index.html");
  res.sendFile(__dirname + "/public");
});
  
app.post("/", async function(req, res) {
    var sentence = String(req.body.sentence);  
    console.log(sentence);
    const payload = JSON.stringify({ msg: sentence });

    response = await sendData(sentence).then((data) => {
        const response = {
            pred: data
        };
    return response;
    });

    res.send(response);
    
});
  
app.listen(3000, function(){
  console.log("server is running on port 3000");
})





