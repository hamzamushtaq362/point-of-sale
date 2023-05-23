const countryModels = require("../models/countries");
const csvtojson = require("csvtojson");
const Api404Error = require("../api404Error");

exports.countriesSeeder = async function (req, res) {
    try {
        const countryData = await countryModels.find({});
        // console.log(countryData);

        const count = await countryModels.count();
        // console.log(count);
        if (countryData == null) {
            return res.status(200).json({
                message: "Country list Data",
                countryData,
            });
        }
        else if (countryData == "") {
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
                                // countryCsvData,
                            });
                        });
                });
        }else{
            return res.status(200).json({
                message: "Country already exist",
                countryData,
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