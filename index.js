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
  service: 'yahoo',
  auth: {
    user: email_id,
    pass: email_password
  }
});

var getDate = function () {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  today = dd + '-' + mm + '-' + yyyy;
  return today;
}



app.get('/sendfile', function (req, res) {

  download(url, function (error, fileData) {
    var s = 'NSE Full data';
    if (error) {
      s = 'Alert:Error downloading NSE Data';
    }

    const mailOptions = {
      from: email_id, // sender address
      to: 'anurag.alw@gmail.com', // list of receivers
      subject: s, // Subject line
      html: '<p>NSE Full data attached</p>',// plain text body
      attachments: [
        {
          filename: "sec_bhavdata_full_" + getDate()+".csv",
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








