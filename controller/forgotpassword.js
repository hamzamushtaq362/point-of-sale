const { validationResult } = require("express-validator");
const users = require("../models/users");
const bcrypt = require("bcryptjs");
var nodemailer = require("nodemailer");

async function sendMailForPassword(user, callback) {
  try {
    // create reusable transporter object using the default SMTP transport
    let transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "Gmail",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "samiakbar680@gmail.com",
        pass: "rerlqngbuzszkmco",
      },
    });

    let mailOptions = {
      from: '"samiakbar680@gmail.com"', // sender address
      to: user.email,
      subject: " Welcome To POS",
      html: `<h1> Forgot Password </h1><br>
       
      <a href="http://localhost:4200/newpassword">Click Here</a>`,
    };
    // send email with defined transport object
    let info = await transport.sendMail(mailOptions);
    return callback(info);
  } catch (error) {
    return res.status(500).send("Some error occurred");
  }
}

exports.verifyEmail = async function (req, res) {
  let success = false;
  // if there are errors return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }

  try {
    // const {email} = req.body;
    let user = await users.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ success, error: "Sorry! Email not found" });
    }
    // console.log(user);

    sendMailForPassword(user, (info) => {
      console.log(`the mail has been sent and id is: ${info.messageId}`);
      //   return res.send(info);
    });
    return res.json({ user });
  } catch (error) {
    console.error(error.message);
    return res.status(401).json("Some error occured");
  }
};

exports.newPassword = async function (req, res) {
  const { password, confirmPassword } = req.body;
  // console.log("body is:",req.body);
  // console.log(req.params.id)

  try {
    let user = await users.findById(req.params.id);
    if (!user) {
      return res.status(404).json("Not Found ");
    }

    // console.log("=========",user);

    if (password !== confirmPassword) {
      return res.status(422).json({ success, error: "Passwords do not match" });
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(password, salt);
    // console.log(secPass)
    user = await users.findByIdAndUpdate(user, {
      password: secPass,
    });
    // console.log(user)
    return res.json({ user });
  } catch (error) {
    console.error(error.message);
    return res.status(410).json("Internal Server Error");
  }
};
