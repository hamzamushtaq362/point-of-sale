const { validationResult } = require("express-validator");
const users = require("../models/users");
const bcrypt = require("bcryptjs");
const jwtoken = require("jsonwebtoken");
const Email = require("../controller/email");
const roleModel = require("../models/role");
const store = require("../models/storeModel");
const countryModel = require("../models/countries");
const permissionModel = require("../models/permissions");

exports.login = async function (req, res) {
  const { email, password } = req.body;
  let user = await users
    .findOne({ email })

  let storeId = user.storeId;
  if (!storeId) {
    storeId = await store.find({ ownerId: user._id }).select("_id")
  }
  console.log(storeId);

  console.log(user);
  if (!user) {
    return res.status(404).json({
      message: "Please enter valid email",
    });
  }
  if (user.status == "pending" || user.status == "decline") {
    return res.status(401).json({
      message: `user is in ${user.status} state`,
    });
  }
  if (email !== user.email) {
    return res.status(401).json({
      message: "Please enter valid Email ",
    });
  }
  let pass = await bcrypt.compare(password, user.password);
  if (!pass) {
    return res.status(401).json({
      message: "Please enter valid Password",
    });
  }

  const token = await jwtoken.sign(
    {
      _id: `${user._id}`,
      email: `${email}`,
      status: `${user.status}`,
      role_id: `${user.role_id}`,
      store_id: `${storeId}`
    },
    "authentication-token"
  );
  // console.log("SAMI SAYS: ", user);
  return res.status(200).json({
    id: user._id,
    token,
    store: user.storeId,
    role: user.role_id,
    first: user.firstName,
    last: user.lastName,
    mail: user.email,
  });
};

exports.employeeAdd = async function (req, res) {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }
  try {
    console.log(req.access.employeeAdd);
    if (req.access.employeeAdd) {
      let role = await roleModel.findOne({ role: req.body.Rolename });
      // console.log("====> role in registrer", role);
      console.log("role in controller=",req.body.Rolename);
      if (!role) {
        role = await roleModel.create({
          role: req.body.Rolename,
        });
      }

      let userData = await users.findOne({ email: req.user });
      if (!userData) {
        return res.status(404).json({
          message: `${req.body.role} not found`,
        });
      }
      function password(passwordLength) {
        let numberChars = "0123456789";
        let upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let lowerChars = "abcdefghijklmnopqrstuvwxyz";
        let allChars = numberChars + upperChars + lowerChars;
        let randPasswordArray = Array(passwordLength);
        randPasswordArray[0] = numberChars;
        randPasswordArray[1] = upperChars;
        randPasswordArray[2] = lowerChars;
        randPasswordArray = randPasswordArray.fill(allChars, 3);
        return shuffleArray(
          randPasswordArray.map(function (x) {
            return x[Math.floor(Math.random() * x.length)];
          })
        ).join("");
      }
      function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          let temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }
        return array;
      }
      let userPassword = password(8);
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(userPassword, salt);
      let email = await users.findOne({ email: req.body.email });
      if (email) {
        return res.status(401).json({
          message:
            "The User with this email already exists Please Use another email or deactivate your account from other organization",
        });
      }
      userData = await users.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: secPass,
        contact: req.body.contact,
        company: req.body.company,
        address: req.body.address,
        role_id: role._id,
        status: userData.status,
        ownerId: userData._id,
        storeId: req.store,
      });
      let user = req.body;
      let pass = userPassword;
      Email.forManager(user, pass, (info) => {
        // console.log(`the mail has been sent and id is: ${info.messageId}`);
      });
      const data = {
        Data: {
          id: userData.id,
        },
      };
      success = true;
      return res.json({ success, data });
    }
  } catch (error) {
    console.error(error.message);

    return res.status(401).json("Some error occured in users in controller.js");
  }
};


// Role Model/ User Model API
exports.users = async function (req, res) {
  console.log("IS THIS WORKING OR NOT ?");
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }
  try {
    console.log("Hello hello");

    if (req.body.Rolename == "admin") {
      // console.log("nsvdjksndvjksssssssssss", req.body.role);
      let role = await roleModel.findOne({role: req.body.Rolename});
      if(!role){
          let permissions = await permissionModel.create({
              employeeAdd : req.body.ecreate,
              employeeView: req.body.eread,
              employeeUpdate: req.body.eupdate,
              employeeDelete: req.body.edelete,
              purchaseAdd: req.body.purcreate,
              purchaseView: req.body.purread,
              purchaseUpdate: req.body.purupdate,
              purchaseDelete: req.body.purdelete,
              productAdd: req.body.pcreate,
              productView: req.body.pread,
              productUpdate: req.body.pupdate,
              productDelete: req.body.pdelete,
              supplierAdd: req.body.screate,
              supplierView: req.body.sread,
              supplierUpdate: req.body.supdate,
              supplierDelete: req.body.sdelete,
              expenseAdd: req.body.expcreate,
              expenseView: req.body.expread,
              expenseUpdate: req.body.expupdate,
              expenseDelete: req.body.expdelete,
              storeAdd: req.body.storecreate,
              storeCreate: req.body.storeread,
              storeUpdate: req.body.storeupdate,
              storeDelete: req.body.storedelete,
              sellProduct: req.body.sellproduct,
              sellView: req.body.sellview,
              sellUpdate: req.body.sellupdate,
              sellDelete: req.body.selldelete
        
          });
          console.log(permissions._id);
      
          
          role = await roleModel.create({
              role: req.body.Rolename,
              permission_id: permissions._id
          })

        }
      // let role = await roleModel.findOne({ role: req.body.Rolename });
      // // console.log("====> role in registrer",role);
      // if (!role) {
      //   role = await roleModel.create({
      //     role: req.body.Rolename,
      //   });
      // }

      let country = await countryModel.findOne({
        countryName: req.body.country,
      });
      console.log("kdmvkmkdmvkdmkdkmvdkmv", country.countryName);
      if (!country) {
        return res.status(404).json({
          error: "country not found",
        });
      }

      const { password, confirmPassword } = req.body;

      let userData = await users.findOne({ email: req.body.email });
      if (userData) {
        return res.status(400).json({
          success,
          error: "Sorry a user with this email already exist",
        });
      }
      if (password !== confirmPassword) {
        return res
          .status(422)
          .json({ success, error: "Passwords do not match" });
      }
      let user = req.body;
      // // console.log(user);
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      userData = await users.create({
        name: req.body.name,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: secPass,
        phoneNumber: req.body.phoneNumber,
        company: req.body.company,
        country_id: country._id,
        Address: req.body.address,
        role_id: role._id,
        status: req.body.status,
      });
      const data = {
        userData: {
          id: userData.id,
        },
      };
      Email.forUser(user, (info) => {
        console.log(`the mail has been sent and id is: ${info.messageId}`);
      });
      success = true;
      return res.json({ success, data, userData });
    }
  } catch (error) {
    console.error(error.message);

    return res.status(401).json("Some error occured in users in controller.js");
  }
};

exports.findUser = async function (req, res) {
  try {
    let findPerson = await users.findOne({ email: req.user });
    if (findPerson) {
      return res.status(200).json({
        message: "Person found",
        findPerson,
      });
    } else {
      return res.status(404).json({
        message: "Person not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error in function",
    });
  }
};

// Role Model/ User Model API
exports.signup = async function (req, res) {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }
  try {
      // find country from country model
      let country = await countryModel.findOne({
        countryName: req.body.country,
      });
      console.log("country name", country.countryName);
      if (!country) {
        return res.status(404).json({
          error: "country not found",
        });
      }

      const { password, confirmPassword } = req.body;
      // find if user with same email exists
      let userData = await users.findOne({ email: req.body.email });
      if (userData) {
        return res.status(400).json({
          success,
          error: "Sorry a user with this email already exist",
        });
      }
      // Confirm password
      if (password !== confirmPassword) {
        return res
          .status(422)
          .json({ success, error: "Passwords do not match" });
      }
      let user = req.body;
      // Hashing Password
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Creating permissions against user
      let permissions = await permissionModel.create({});
    console.log(permissions._id);

    // Creating roles
    role = await roleModel.create({
      role: req.body.Rolename,
      permission_id: permissions._id
  });

  // Creating new user
    userData = await users.create({
    name: req.body.name,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: secPass,
    contact: req.body.phoneNumber,
    company: req.body.company,
    country_id: country._id,
    Address: req.body.address,
    role_id: role._id,
  });

      const data = {
        userData: {
          id: userData.id,
        },
      };
      Email.forUser(user, (info) => {
        console.log(`the mail has been sent and id is: ${info.messageId}`);
      });
      success = true;
      return res.json({ success, data, userData });
    
  } catch (error) {
    console.error(error.message);

    return res.status(401).json("Some error occured in users in controller.js");
  }
};
