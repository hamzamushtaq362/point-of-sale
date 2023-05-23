const productCategoryModels = require("../models/product_category");
const csvtojson = require("csvtojson");
const Api404Error = require("../api404Error");

exports.categorySeeder = async function (req, res) {
    try {
        const categoryData = await productCategoryModels.find({});
        console.log(categoryData);

        const count = await productCategoryModels.count();
        console.log(count);
        if (categoryData == null) {
            return res.status(200).json({
                message: "Category list Data",
                categoryData,
            });
        }
        else if (categoryData == "") {
            const seedData = [ 
                {
                    category: 'Apperal'
                },
                {
                    category: 'Art'
                },
                {
                    category: 'Electronics'
                },
                {
                    category: 'Beverages'
                },
                {
                    category: 'Health_Beauty'
                },
                {
                    category: 'Health_Care'
                },
            ];
            csvtojson()
                .fromFile("public/category.csv")
                .then(async (csvData) => {
                    // console.log(csvData);
                    await productCategoryModels
                        .insertMany(seedData)
                        .then((res1) => {
                            // console.log(csvData);
                            return res.status(200).json({
                                message: "Category added successfuly!",
                                // countryCsvData,
                            });
                        });
                });
        }else{
            return res.status(200).json({
                message: "Category already exist",
                categoryData,
            });
        }
    } catch (error) {
        console.log("---------", error);
        return res.status(500).json({
            error:
                "Something went wrong which is why category collection is not working",
        });
    }
};