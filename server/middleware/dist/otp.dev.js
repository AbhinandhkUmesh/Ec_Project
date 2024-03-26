"use strict";

var nodemailer = require("nodemailer");

var otpGenerator = require("otp-generator");

var sendmail = function sendmail(email) {
  try {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });
    var otp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false
    });
    var mailOptions = {
      from: "AnB Store<info@AnNStore.com>",
      // sender address
      to: email,
      // To the receiver
      subject: "E-Mail Verification",
      text: "Your OTP is:" + otp
    };
    transporter.sendMail(mailOptions);
    console.log("E-mail sent successfully");
    return otp;
  } catch (err) {
    console.log("error in sending mail:", err);
  }
};

module.exports = {
  sendmail: sendmail
};