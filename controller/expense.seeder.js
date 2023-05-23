const expenseModels = require("../models/category_expense");
const csvtojson = require("csvtojson");
const Api404Error = require("../api404Error");

exports.expenseSeeder = async function (req, res) {
    try {
        const categoryData = await expenseModels.find({});
        console.log(categoryData);

        const count = await expenseModels.count();
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
                    category: 'Advertising and marketing'
                },
                {
                    category: 'Maintenance and repairs'
                },
                {
                    category: 'Telephone'
                },
                {
                    category: 'Electricity Bill'
                },
                {
                    category: 'ShowRoom Rent'
                },
                {
                    category: 'Taxes'
                },
                {
                    category: 'Salaries and other compensation'
                },
                {
                    category: 'Medical Expense'
                },
                {
                    category: 'Employee benefit programs'
                },
                {
                    category: 'books and magazine subsription'
                },
                {
                    category: 'Insurance'
                },
                {
                    category: 'Utilies'
                },
                {
                    category: 'website and software expenses'
                },
                {
                    category: 'Entertainmment'
                },
                {
                    category: 'Business meals and travel expense'
                },
                {
                    category: 'Interest payment and bank fees'
                }
            ];
            csvtojson()
                .fromFile("public/category.csv")
                .then(async (csvData) => {
                    // console.log(csvData);
                    await expenseModels
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