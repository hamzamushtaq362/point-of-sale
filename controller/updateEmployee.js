let user = require('../models/users');
exports.updateEmployee = async function (req, res) {
    

    try {
        let id = req.params.id;

        const employeeUpdate = await user.findByIdAndUpdate(
            id,
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                contact: req.body.contact,
                address: req.body.address,
            },
            {
                new: true,
            }
        );
        return res.status(200).json({
            message: "Employee Updated",
            employeeUpdate,
        });
    } catch (error) {
        console.log(error);
    }
};