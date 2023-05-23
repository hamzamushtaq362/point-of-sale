const review = require("../models/productReview");
const sales = require("../models/saleModel");
const config=require('../config');

exports.productReview = async function (req, res) {
  try {
    const totalResult = await review.find({}, 'rating _id');
    let averageRatingNumerator = 0;
    let averageRatingDenominator = 0;

    if (totalResult) {
      totalResult.forEach((eachRate) => {
        averageRatingDenominator += 1;
        averageRatingNumerator += eachRate.rating;
      });
    }

    return res.status(200).json({
      message: "Total Reviews of Products",
      Rating: averageRatingNumerator,
    });
  } catch (error) {
    return res.status(404).json({
      error: "Review is not found",
    });
  }
};

exports.productCount = async function (req, res) {
    try {

        let sale = await sales
        .find({});
        // .populate('_id');
        // const ganja=sale[0].soldProducts[0]._id;
        // console.log("try", ganja);
        // console.log(sale);

        // for(let i=0; i<sale.length;i++){
        //     // console.log(sale[i]._id);
        //     let value=sale[i]._id
        //     console.log(value);
        //     sale.populate("value");
        // }

        const counts = {};
        const arr=[];

        while(arr.length > 0) {
            arr.pop();
        }

        for(let i=0; i<sale.length;i++){
                // console.log(sale[i].soldProducts[0]._id);
                arr.push(sale[i].soldProducts[0]._id);
                // console.log(arr[i]);
                // const sampleArray = ['a', 'a', 'b', 'c'];
            }

            // arr.map((e)=>{
            //     console.log(e);
            // })

            // arr.map((e)=>{
            //     console.log(e);
            // })

            arr.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
            // console.log("Counts",counts);

            // console.log(Object.keys(counts));
            // console.log(Object.values(counts));

            const prod= Object.keys(counts);
            console.log("Product",prod);
            const val= Object.values(counts);
            // console.log(val[0]);
            // console.log(Object.entries(counts));

            // let reviewId = await review.findByIdAndUpdate(id, {
            //   email: req.body.email,
            //   password: req.body.password,
            // })

            // console.log(prod.length);
            await review.deleteMany({});
            console.log("Deleted now create");
            for(let i=0; i<prod.length;i++){
                // console.log(i);
                // console.log(reviewData[i].product.toString());

                // if(reviewData[i].product.toString() == prod[i] && reviewData[i].count == val[i]){
                //   console.log("Same if");
                // }else if(reviewData[i].count < val[i]){
                //   console.log("else if");
                //   let id=reviewData[i]._id.toString();
                //   // console.log("id",id);

                //   let reviewId = await review.findByIdAndUpdate(id, {
                //       count: val[i]
                //     });
                // }
                // else{
                //   console.log("else");
                //   await review.create({
                //     count: val[i],
                //     product: prod[i]
                //   });

                //   return res.status(200).json({
                //     message: "Total Reviews of Products",
                //     Populated: sale,
                //   });
                // }

                // console.log(reviewData[i]._id.toString());
                await review.create({
                        count: val[i],
                        product: prod[i]
                      });
            }

            // Data = await review.create({
            //     count: val[0],
            //     product: prod[0]
            //   });

            // await review.insertMany(prod[i])
            //             .then((res1) => {
            //                 // console.log(csvData);
            //                 return res.status(200).json({
            //                     message: "Category added successfuly!",
            //                     // countryCsvData,
            //                 });
            //             });

            //   console.log("Created");

            // { '63c4d51183e56ecae16785a4': 4, '63cf686ed74743df008957f9': 1 }
  
      return res.status(200).json({
        message: "Total Reviews of Products",
        Populated: sale,
      });
    } catch (error) {
      return res.status(404).json({
        error: "Review is not found",
      });
    }
  };

  exports.bestSelling = async function (req, res) {
    try {
        var sort = { count: -1 };
        let best = await review.find().sort(sort).limit(config.test.bestSelling);
        // .find({});

      return res.status(200).json({
        message: "Count of Products",
        Total: best,
      });
    } catch (error) {
      return res.status(404).json({
        error: "Review is not found",
      });
    }
  };
