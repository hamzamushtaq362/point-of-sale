const Product = require("../models/addproductmodel");
const cloudinary = require("cloudinary").v2;
const categoryDB = require("../models/product_category");
const notificat = require("../sockets");
const summaryOfProducts = require("../models/productSummary");
const roleModel = require("../models/role");

cloudinary.config({
  cloud_name: "abdul-basit",
  api_key: "745415375475247",
  api_secret: "hoNCncp6wNz-MZ4qTenDf9VUBOY",
  secure: true,
});

exports.check = async (req, res) => {
  let key = req.query.q;
  console.log(key);
  try {
    console.log(req.access.productAdd);
    if (req.access.productAdd) {
      let product1 = await Product.findOne({
        store_id: req.store,
        barcode_id: key,
      });
      if (product1) {
        return res.status(200).json({
          message: "product already exist",
        });
      } else if (product1 == null) {
        throw "error";
      }
    } else {
      return res.status(401).json("you have no access for this route");
    }
  } catch (err) {
    return res.status(404).json({
      message: err,
    });
  }
};

exports.photo = async function (req, res) {
  console.log("hhhshshs");
  try {
    if (req.access.productAdd) {
      console.log(req.files.file);
      const file1 = req.files.file;

      cloudinary.uploader.upload(
        file1.tempFilePath,
        { transformation: { width: 200, height: 200, crop: "fill" } },
        (err, result) => {
          return res.status(200).json(result);
        }
      );
    } else {
      return res.status(401).json("you have no access for this route");
    }
  } catch (error) {
    return res.status(401).json({ error, message: "not found" });
  }
};

exports.create = async function (req, res) {
  console.log("Product Create Controller");
  try {
    // Custom access code
    // let permission = await roleModel
    // .findOne({ _id: req.access })
    // .populate({ path: "permission_id" 
    // });
    // console.log("create Product");
    // console.log(permission.permission_id.productAdd);
    
    if (true) {
      console.log("I Am IN");
      console.log(req.body.category);
      let category = await categoryDB.findOne({ category: req.body.category });
      // if (!category) {
      //   return res.status(404).json({
      //     error: "Not found",
      //   });
      // }

      let product1 = await Product.findOne({
        store_id: req.store,
        barcode_id: req.body.barcode_id,
      });

      if (product1) {
        throw "already exist";
      } else {
        await Product.create({
          image_no: req.body.image_no,
          product_image: req.body.product_image,
          barcode_id: req.body.barcode_id,
          product_name: req.body.product_name.toLowerCase(),
          product_price: req.body.product_price,
          category: category._id,
          size: req.body.size,
          quantity: req.body.quantity,
          store_id: req.store,
        }).then((d3) => {
          console.log("====1===");
          const data = {
            supplier: {
              id: d3.id,
            },
          };
          // summaryOfSuppliers.find({ storeId: req.store }).then((storeRes) => {
          summaryOfProducts
            .find({
              // cities: req.body.city,
              storeId: req.store,
              category: req.body.category,
            })
            .then((responce) => {
              console.log("====2===", responce);
              if (responce.length) {
                let count = responce[0].count + 1;
                console.log("new count", count);
                console.log("increment in summaryOfProducts");
                summaryOfProducts
                  .updateOne(
                    { _id: responce[0]._id },
                    { $set: { count: count } }
                  )
                  .then((d) => {
                    console.log("====3===", d);
                    return res.status(200).json({
                      data,
                    });
                  });
              } else {
                console.log("else create summaryOfProducts");
                summaryOfProducts
                  .create({
                    storeId: req.store,
                    count: 1,
                    category: req.body.category,
                  })
                  .then((d2) => {
                    console.log("====4===");
                    return res.json({ message: "added by admin" });
                  });
              }
            });
          // });
        });
      }
    } else {
      return res.status(401).json("you have no access for this route");
    }
  } catch (error) {
    return res.status(401).json({ error });
  }
};

exports.updateProduct = async function (req, res) {
  try {
    // Custom access code
    // let permission = await roleModel
    // .findOne({ _id: req.access })
    // .populate({ path: "permission_id" 
    // });
    // console.log("updateProduct");
    // console.log(permission.permission_id.productUpdate);

    if (req.access.productUpdate) {
      let category = await categoryDB.findOne({ category: req.body.category });
      if (!category) {
        category = await categoryDB.create({
          category: req.body.category,
        });
      }
      let _id = req.params.id;
      const productupdate = await Product.findByIdAndUpdate(
        _id,
        {
          image_no: req.body.image_no,
          product_image: req.body.product_image,
          barcode_id: req.body.barcode_id,
          product_name: req.body.product_name,
          product_price: req.body.product_price,
          category: category._id,
          size: req.body.size,
          quantity: req.body.quantity,
        },
        {
          new: true,
        }
      );
      return res.status(200).json({
        message: "The product has been updated",
        productupdate,
      });
    } else {
      return res.status(401).json("you have no access for this route");
    }
  } catch (error) {
    return res.status(401).json("error");
  }
};

exports.viewone = async function (req, res) {
  const id = req.params.id;

  try {
    // Custom access code
    // let permission = await roleModel
    // .findOne({ _id: req.access })
    // .populate({ path: "permission_id" 
    // });
    // console.log("viewone");
    // console.log(permission.permission_id.productView);

    if (req.access.productView) {
      const product = await Product.findOne({ _id: id });

      return res.status(200).json({
        product,
      });
    } else {
      return res.status(401).json("you have no access for this route");
    }
  } catch (error) {
    return res.status(401).json({
      message: "not found",
    });
  }
};

exports.viewProducts = async function (req, res) {
  console.log("View Product Running");
  try {
    // Custom access code
    // let permission = await roleModel
    // .findOne({ _id: req.access })
    // .populate({ path: "permission_id" 
    // });
    // console.log("viewone");
    // console.log(permission.permission_id.productView);

    if (req.access.productView) {
      console.log("await");
      const data = await Product.find({ store_id: req.store })
        .populate("category")
        .sort({
          $natural: -1,
        });
      console.log("await complete");

      return res.status(200).json({
        data,
      });
    } else {
      return res.status(401).json("you have no access for this route");
    }
  } catch (error) {
    return res.status(401).json({
      message: "not found",
    });
  }
};

exports.deleteProduct = async function (req, res) {
  let id = req.params.id;

  try {
    if (req.access.productDelete) {
      let data = await Product.findById(id);
      cloudinary.uploader.destroy(data.image_no, function (result) {});
      data = await Product.findByIdAndDelete(id);

      return res.status(200).json({
        message: "deleted",
      });
    } else {
      return res.status(401).json("you have no access for this route");
    }
  } catch (error) {
    return res.status(401).json({
      message: "product cannot be deleted",
    });
  }
};

exports.deleteImg = async (req, res) => {
  try {
    const data = req.body;
    cloudinary.uploader.destroy(data.img_path, function (result) {
      return res.status(200).json({
        message: "Image deleted",
      });
    });
  } catch (error) {
    return res.status(401).json({
      message: "product cannot be deleted",
    });
  }
};

//-----------------------PAGINATION---------------------------

exports.ProductPagination = async function (req, res) {
  try {
    if (req.access.productView) {
      let { page, size } = req.query;
      if (!page) {
        page = 1;
      }
      if (!size) {
        size = 10;
      }
      const limit = parseInt(size);
      const skip = (page - 1) * size;
      const productDatabyPage = await Product.find({}).limit(limit).skip(skip);
      res.status(200).json({
        message: "List shown",
        productDatabyPage,
      });
    } else {
      return res.status(401).json("you have no access for this route");
    }
  } catch (error) {
    return res.status(401).json({
      error: "error appeared",
    });
  }
};

exports.searchProductDetails = async function (req, res) {
  let searchProduct = null;
  try {
    // Custom access code
    // let permission = await roleModel
    // .findOne({ _id: req.access })
    // .populate({ path: "permission_id" 
    // });
    // console.log("search Product Details");
    // console.log(permission.permission_id.productView);
    // console.log(req.access.productView);
    if (req.access.productView) {
      let obj = req.query.search;
      searchProduct = await Product.find({
        store_id: req.store,
        $or: [
          { product_name: { $regex: obj } },
          { category: { $regex: obj } },
          { barcode_id: { $regex: obj } },
        ],
      });

      return res.status(200).json({
        message: "Details found ",
        searchProduct,
      });
    } else {
      return res.status(401).json("you have no access for this route");
    }
  } catch (error) {
    return res.status(404).json({
      message: "Details not found ",
    });
  }
};

exports.productcategory = async function (req, res) {
  try {
    // Custom access code
    // let permission = await roleModel
    // .findOne({ _id: req.access })
    // .populate({ path: "permission_id" 
    // });
    // console.log("product Category");
    // console.log(permission.permission_id.productView);

    if (req.access.productView) {
      let category = await categoryDB.find({});

      return res.status(200).json({ category });
    } else {
      return res.status(401).json("you have no access for this route");
    }
  } catch (error) {
    return res.status(404).error();
  }
};

exports.upload = function (req, res) {
  // req.file is the name of your file in the form above, here 'uploaded_file'
  // req.body will hold the text fields, if there were any 
  console.log(req.file)
  //    console.log(req.body);
  let path="C:/SSD Data/NODE_JS/Practice 6/uploads/";

  return res.status(200).json({
   path
  })  
}
