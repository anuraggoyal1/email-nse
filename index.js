var nodemailer = require('nodemailer');
var express = require('express');
var app = express();
var url = "https://www.nseindia.com/products/content/sec_bhavdata_full.csv";

var email_id = process.env.EMAIL_ID;
var email_password = process.env.EMAIL_PASSWORD
var download = function (url, cb) {
  var data = "";
  var request = require("https").get(url, function (res) {

    res.on('data', function (chunk) {
      data += chunk;
    });

    res.on('end', function () {
      if (res.statusCode == 200)
        cb(null, data);
      else
        cb(res.statusCode)
    })
  });

  request.on('error', function (e) {
    console.log("Got error: " + e.message);
    cb("error downloading  NSE file");
  });
}


var port = process.env.PORT || 8080;

var server = app.listen(port, function () {
  var host = server.address().address
  console.log("started app & listening at http://%s:%s", host, port)
})

var transporter = nodemailer.createTransport({
  //service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: email_id,
    pass: email_password
  }
});



app.get('/sendfile', function (req, res) {

  download(url, function (error, fileData) {
    var s = 'NSE Full data';
    if (error) {
      s = 'Alert:Error downloading NSE Data';
    }

    const mailOptions = {
      from: email_id, // sender address
      to: email_id, // list of receivers
      subject: s, // Subject line
      html: '<p>NSE Full data attached</p>',// plain text body
      attachments: [
        {
          filename: "full.csv",
          content: fileData
        }
      ]
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err)
        console.log(err)
      else
        console.log(info);
    });

  })

  res.statusCode = '200';
  res.send('success');

})








