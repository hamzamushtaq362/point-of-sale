const addSupplier = require("../models/supplierAdd");
const users = require("../models/users");
const countryModels = require("../models/countries");
const Api404Error = require("../api404Error");
const csvtojson = require("csvtojson");
const summaryOfSuppliers = require("../models/supplierSummary");

exports.addSupplier = async function (req, res, next) {
  try {
    // if (req.access.supplierAdd) {
    console.log("body contains: ", req.store);
    console.log("admin Id: ", req.user);
    console.log("Role:", req.role);

    let countryModel = await countryModels.findOne({
      countryName: req.body.country,
    });

    if (!countryModel) {
      console.log(countryModel);
      throw new Error(`The COUNTRY :${req.body.country} not found.`);
      // return res.status(404).json({
      //   error: "Country not found",
      // });
    }
    let supplier = await addSupplier.findOne({
      emailSupplier: req.body.emailSupplier,
    });
    console.log(supplier);
    if (supplier) {
      return res.status(400).json({
        error:
          "Sorry a supplier with this email already exists, kindly change your email",
      });
    }
    if (
      req.body.supplierName == "" ||
      req.body.supplierLastName == "" ||
      req.body.contact == "" ||
      req.body.emailSupplier == "" ||
      countryModel._id == "" ||
      req.body.city == ""
    ) {
      return res.status(400).json({
        error: "All fields need to be filled",
      });
    }
    if (countryModel.countryName == req.body.city) {
      return res.status(400).json({
        error: "Country and city cannot have same name",
      });
    }
    console.log("HAHAHAHA", req.store);

    supplier = await addSupplier
      .create({
        supplierName: req.body.supplierName,
        supplierLastName: req.body.supplierLastName,
        contact: req.body.contact,
        emailSupplier: req.body.emailSupplier,
        country: countryModel._id,
        city: req.body.city,
        storeId: req.store,
      })
      .then((d3) => {
        console.log("====1===");
        const data = {
          supplier: {
            id: d3.id,
          },
        };
        // summaryOfSuppliers.find({ storeId: req.store }).then((storeRes) => {
        summaryOfSuppliers
          .find({
            // cities: req.body.city,
            storeId: req.store,
            country: req.body.country,
          })
          .then((responce) => {
            console.log("====2===", responce);
            if (responce.length) {
              let count = responce[0].count + 1;
              console.log("new count", count);
              summaryOfSuppliers
                .updateOne({ _id: responce[0]._id }, { $set: { count: count } })
                .then((d) => {
                  console.log("====3===", d);
                  return res.status(200).json({
                    supplier,
                    data,
                    countryModel,
                  });
                });
            } else {
              summaryOfSuppliers
                .create({
                  cities: req.body.city,
                  storeId: req.store,
                  count: 1,
                  country: req.body.country,
                })
                .then((d2) => {
                  console.log("====4===");
                  return res.status(200).json({
                    supplier,
                    data,
                    countryModel,
                  });
                });
            }
          });
        // });
      });

    // } else {
    //   return res.status(401).json("you have no access for this route");
    // }
  } catch (error) {
    console.error(error.message);
    return res.status(401).json({
      error: "Supplier will not be added",
    });
  }
};

exports.deleteSupplier = async function (req, res) {
  try {
    if (req.access.supplierDelete) {
      let _id = req.params.id;
      console.log("id is : ", _id);

      let deleteSupplierData = await addSupplier.findById({
        _id: req.params.id,
        deleted: false,
      });
      if (!deleteSupplierData || deleteSupplierData.deleted === true) {
        return res.status(404).json({
          error: "This ID does not exist",
        });
      }

      deleteSupplierData.deleted = true;
      if (deleteSupplierData.deleted == true) {
        let deleteSuppSummary = await summaryOfSuppliers
          .find({ storeId: req.store, deleted: false })
          .then((response) => {
            console.log("====2===", response);
            if (response.length) {
              let count = response[0].count - 1;
              console.log("new count", count);
              summaryOfSuppliers
                .updateOne({ _id: response[0]._id }, { $set: { count: count } })
                .then((del) => {
                  console.log("====3===", del);
                  return res.status(200).json({
                    message: "Supplier Summary is deleted",
                    del,
                    deleteSuppSummary,
                  });
                });
            } else {
              return res.status(400).json({
                error: "The supplier cannot be deleted",
              });
            }
          });
        await deleteSupplierData.save();
      }
    } else {
      return res.status(401).json("you have no access for this route");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Delete function's try block is not working",
    });
  }
};

exports.updateSuppliers = async function (req, res) {
  try {
    let alphabetReg = /^[a-zA-Z]+$/;
    let numberReg = /[0-9]+/;
    let noSpaceReg = /^\S*$/;
    if (req.access.supplierUpdate) {
      let _id = req.params.id;

      if (
        req.body.supplierName == "" ||
        req.body.supplierLastName == "" ||
        req.body.contact == "" ||
        req.body.city == ""
      ) {
        return res.status(400).json({
          error: "All fields need to be filled",
        });
      }
      if (
        req.body.supplierName.length < 3 ||
        req.body.supplierName.length > 40
      ) {
        return res.status(400).json({
          error: "Min length should be 3 and max length should be 40",
        });
      }
      if (req.body.city.length < 4 || req.body.city.length > 40) {
        return res.status(400).json({
          error: "Min length should be 4 and max length should be 40",
        });
      }
      if (req.body.contact.length < 11 || req.body.contact.length > 11) {
        return res.status(400).json({
          error: "The characters should be 11 digits exact",
        });
      }

      if (
        !alphabetReg.test(req.body.supplierName) ||
        !alphabetReg.test(req.body.supplierLastName) ||
        !alphabetReg.test(req.body.city)
      ) {
        return res.status(400).json({
          error: "Only Alphabets are allowed",
        });
      }
      if (
        !noSpaceReg.test(req.body.supplierName) ||
        !noSpaceReg.test(req.body.supplierLastName) ||
        !noSpaceReg.test(req.body.city) ||
        !noSpaceReg.test(req.body.contact)
      ) {
        return res.status(400).json({
          error: "Spaces are not allowed",
        });
      }
      if (!numberReg.test(req.body.contact)) {
        return res.status(400).json({
          error: "contact should only contain numbers",
        });
      }

      const supplierUpdate = await addSupplier.findByIdAndUpdate(
        _id,
        {
          supplierName: req.body.supplierName,
          supplierLastName: req.body.supplierLastName,
          contact: req.body.contact,
          city: req.body.city,
        },
        {
          new: true,
        }
      );
      console.log("Updated Supplier: ", supplierUpdate);
      return res.status(200).json({
        message: "The supplier has been updated",
        supplierUpdate,
      });
    } else {
      return res.status(401).json("you have no access for this route");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Something went wrong in update suppliers function",
    });
  }
};
// exports.searchSupplierDetails = async function (req, res) {
//   try {
//     let key = req.query.find;
//     let query = {
//       $or: [
//         {
//           countryName: { $regex: key, $options: "i" },
//           supplierName: { $regex: key, $options: "i" },
//           supplierLastName: { $regex: key, $options: "i" },
//           contact: { $regex: key },
//         },
//       ],
//     };
//     // let query2 = {
//     //   deleted: false,
//     //   $or: [
//     //     { supplierName: { $regex: key, $options: "i" } },
//     //     { supplierLastName: { $regex: key, $options: "i" } },
//     //     { contact: { $regex: key } },
//     //   ],
//     // };

//     countryModels.find(query).then((res1) => {
//       if (res1 && res1.length) {
//         // let data = [];
//         let suppliers = [];

//         // let promise1 = new Promise((resolve) => {
//         for (let i = 0; i < res1.length; i++) {
//           suppliers.push(
//             addSupplier
//               .find({
//                 deleted: false,
//                 country: res1[i]._id,
//               })
//               .sort({ date: -1 })
//               .lean()
//               .populate("country", "countryName")
//           );
//         }
//         Promise.all(suppliers).then((response) => {
//           let data = [].concat.apply([], response);
//           return res.status(200).json({
//             message: "supplier shown",
//             data,
//           });
//         });
//         // .then((data) => {
//         //   console.log("hazique", data);
//         // });
//         // .all();
//         // });
//       } else {
//         console.log("Hazique");
//         addSupplier
//           .find(query.supplierName)
//           .populate("country", "countryName")
//           .then((data) => {
//             // let suppsData = [].concat.apply([], supps);
//             console.log("LETS GOOOOOOOOOOOO", data);

//             return res.status(200).json({
//               message: "Suppliers have been found",
//               data,
//             });
//           });

//       }
//     });

//     // let searchSupplier = await addSupplier
//     //   .find(query2)
//     //   .sort({ date: -1 })
//     //   .lean()
//     //   .populate("country", "countryName");
//     // if (searchSupplier) {
//     //   return res.status(200).json({
//     //     message: "Details found ",
//     //     searchSupplier,
//     //   });
//     // } else {
//     //   return res.status(404).json({
//     //     error: "Supplier not found",
//     //   });
//     // }
//   } catch (error) {
//     return res.status(500).json({
//       error:
//         "There is an error which is stopping this controller (searchSupplierDetails) from functioning",
//     });
//   }
// };

exports.searchSupplierDetails = async function (req, res) {
  try {
    if (req.access.supplierView) {
      let key = req.query.find;
      // console.log("========> ", key);

      let searchCountry = await countryModels.find({
        $or: [
          {
            countryName: { $regex: key, $options: "i" },
          },
        ],
      });
      // console.log("HAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHA", searchCountry);

      let searchSupplier = await addSupplier
        .find({
          deleted: false,
          $or: [
            { supplierName: { $regex: key, $options: "i" } },
            { supplierLastName: { $regex: key, $options: "i" } },
            // { country: res.countryName },
            {
              searchCountry: {
                countryName: { $regex: key, $options: "i" },
              },
            },
            { contact: { $regex: key } },
          ],
        })
        .sort({ date: -1 })
        .lean()
        .populate("country", "countryName");

      // console.log(searchSupplier);
      return res.status(200).json({
        message: "Details found ",
        searchSupplier,
      });

      // let countryObject = searchCountry.forEach(function (country) {
      //   console.log(country.countryName);
      // });

      console.log(searchSupplier);
    } else {
      return res.status(401).json("you have no access for this route");
    }
  } catch (error) {
    return res.status(500).json({
      error:
        "There is an error which is stopping this controller (searchSupplierDetails) from functioning",
    });
  }
};

exports.showSuppliers = async function (req, res) {
  try {
    let { page = 1, size = 10 } = req.query;
    const limit = parseInt(size);
    const skip = (parseInt(page) - 1) * limit;

    let count = await addSupplier
      .find({ storeId: req.store, deleted: false })
      .count();
    // console.log("Total Count of Suppliers", count);

    if (req.access.supplierView) {
      let cityInformation = await addSupplier.find({ deleted: false }, "city");
      // console.log("City Information", cityInformation);
      if (!cityInformation) {
        return res.status(404).json({
          error: "City not found",
        });
      }
      // console.log("Hazique", req.role);
      let supplierInformation = await addSupplier
        .find({ storeId: req.store, deleted: false })
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit * 1)
        .lean()
        .populate("country", "countryName");

      if (!supplierInformation) {
        return res.status(404).json({
          error: "Not authorized to view supplier information",
        });
      }
      // console.log("Showing supplier info: ", supplierInformation);

      // console.log("The Supplier Info is : ", supplierInformation);
      return res.status(200).json({
        message: "Supplier info found",
        supplierInformation,
        cityInformation,
        count,
      });
    } else {
      supplierInformation = await addSupplier
        .find({
          storeId: authority.storeId,
          deleted: false,
        })
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit * 1)
        .lean()
        .populate("country", "countryName");
      return res.status(200).json({
        message: "Authorized to view",
        supplierInformation,
      });
    }
  } catch (error) {
    return res.status(404).json({
      error:
        "There is an error which is stopping this controller (showSuppliers) from functioning",
    });
  }
};

// exports.showCountries = async function (req, res) {
//   try {
//     let countryId = [];
//     let countryNames = [];
//     let requiredSupplier = await addSupplier.find({ storeId: req.store });
//     for (let i = 0; i < requiredSupplier.length; i++) {
//       countryId.push(requiredSupplier[i].country);
//       for (let j = i; j < countryId.length; j++) {
//         let countries = await countryModels.findOne({
//           _id: countryId[j],
//         });
//         countryNames.push(countries.countryName);
//       }
//     }
//     return res.status(200).json({
//       countryNames,
//     });
//   } catch (error) {
//     console.log("Required countries are not showing");
//   }
// };

// exports.showDeletedSuppliers = async function (req, res) {
//   try {
//     if (req.role == "admin") {
//       let deletedSupplierInformation = await addSupplier
//         .find({ storeId: req.store, deleted: true })
//         .lean()
//         .populate("country", "countryName");

//       console.log("The Supplier Info is : ", deletedSupplierInformation);
//       return res.status(200).json({
//         message: "Deleted supplier info found",
//         deletedSupplierInformation,
//       });
//     }
//     // console.log(supplierInformation);
//     if (!deletedSupplierInformation) {
//       return res.status(404).json({
//         error: "Not authorized to view supplier information",
//       });
//     }

//     if (req.role == "manager") {
//       let fetchCountry = await country.find();
//       console.log("Countries have been found for Manager : ", fetchCountry);

//       let authority = await users.findOne({ email: req.email });
//       if (!authority) {
//         return res.status(404).json({
//           error: "Not Authorized",
//         });
//       }
//     } else {
//       deletedSupplierInformation = await addSupplier
//         .find({
//           storeId: authority.storeId,
//           deleted: true,
//         })
//         .sort({ date: -1 });
//       return res.status(200).json({
//         message: "Authorized to view",
//         deletedSupplierInformation,
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({
//       error:
//         "There is an error which is stopping this controller (showSuppliers) from functioning",
//     });
//   }
// };
exports.countriesCollection = async function (req, res) {
  try {
    const countryData = await countryModels.find({});
    const count = await countryModels.count();
    if (countryData) {
      return res.status(200).json({
        message: "Country list Data",
        countryData,
      });
    }
    if (countryData == "") {
      csvtojson()
        .fromFile("public/countries.csv")
        .then(async (csvData) => {
          // console.log(csvData);
          const countryCsvData = await countryModels
            .insertMany(csvData)
            .then((res1) => {
              // console.log(csvData);
              return res.status(200).json({
                message: "Country added successfuly!",
                countryCsvData,
              });
            });
        });
    }
  } catch (error) {
    console.log("---------", error);
    return res.status(500).json({
      error:
        "Something went wrong which is why countries collection is not working",
    });
  }
};
