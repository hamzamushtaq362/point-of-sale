var nodemailer = require("nodemailer");

const POSEMAIL = require("../config");
const SMTPConnection = require("nodemailer/lib/smtp-connection");

exports.forUser = async function (user, callback) {
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
      subject: "Welcome To POS",
      html: `<h1> We have receive your store request with the  Email: ${user.email}.</h1>
      <h2> Our management team will contact you for further verification within a week</h2>
      <h2> Your Store Name: ${user.company}</h2>
      <h3>If you have any query, please contact on the below number</h3>
      <h2>Thank You!</h2>
      <br>
      <h4>Regards: POS Management</h4>
      
      <h4>Phone no: 042-583911234</h4>
      
      `,
    };
    // send email with defined transport object
    let info = await transport.sendMail(mailOptions);
    callback(info);
  } catch (error) {
    return res.status(500).send("Some error occured in forUser in email.js");
  }
};
exports.forManager = async function (user, pass, callback) {
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
      subject: "Welcome",
      html: `<h1>Hello ${user.firstName} ${user.lastName} we welcome you in our store.</h1>
      <h2>Your Login Credentials for our portal given below: (Please do not share with anyone!!)</h2>
      <h3> Email: ${user.email} | Password: ${pass}</h3>
      <h3>If you have any query, please contact on the below number</h3>
      <h2>Thank You!</h2>
      <br>
      <h4>Regards: Store Owner</h4>
      
      <h4>Phone no: 042-00000000</h4>
      
      `,
    };
    // send email with defined transport object
    let info = await transport.sendMail(mailOptions);
    callback(info);
  } catch (error) {
    return res
      .status(500)
      .send("Some error occurred in forManager in email.js");
  }
};

exports.forSuperAdmin = async function (user, callback) {
  try {
    // create reusable transporter object using the default SMTP transport
    let transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "Gmail",
      port: 587,
      secure: false,
      auth: {
        user: "samiakbar680@gmail.com",
        pass: "rerlqngbuzszkmco",
      },
    });

    let mailOptions = {
      from: '"samiakbar680@gmail.com"', // sender address
      to: "pointofsale267@gmail.com",
      subject: "Store Registration Request",
      html: `<h1> ${user.firstName} wants to create store.</h1>
      <h3>See below the user details</h3>
      <h4> Email: ${user.email}</h4>
      <h4> Store Name: ${user.company}</h4>
      <h4> Cell No: ${user.phoneNUmber}</h4>
      <h5>Contact him to verify</h5>
      <h2>Thank You!</h2>
      <br>
      <h4>Regards: Point Of Sale</h4>
      <h4>Phone no: 042-583911234</h4>
      
      `,
    };
    // send email with defined transport object
    let info = await transport.sendMail(mailOptions);
    callback(info);
  } catch (error) {
    return res.status(500).send("Some error occurred");
  }
};

exports.onAccept = async function (user, callback) {
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
      subject: "Store Request Accepted",
      html: `<h2> Your request for create store has been accepted by our management team on Email: ${user.email}.</h2>
      <h4>Now you can create your store and increase your sales</h4>
      <h3>Thank You!</h3>
      <br>
      <h4>Regards: Point Of Sale</h4>
      <h4>Phone no: 042-583911234</h4>
      
      `,
    };
    // send email with defined transport object
    let info = await transport.sendMail(mailOptions);
    callback(info);
  } catch (error) {
    return res.status(500).send("Some error occurred");
  }
};

exports.onReject = async function (user, callback) {
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
      subject: "Store Request Rejected",
      html: `<h2> Your request for create store has been Rejected by our management team on Email: ${user.email}.</h2>
      <h4>Because, you are not a verified</h4>
      <h3>Thank You!</h3>
      <br>
      <h4>Regards: Point Of Sale</h4>
      <h4>Phone no: 042-583911234</h4>
      
      `,
    };
    let info = await transport.sendMail(mailOptions);
    callback(info);
  } catch (error) {
    return res.status(500).send("Some error occurred");
  }
};
