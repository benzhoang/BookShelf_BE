const Role = require("../models/role.model");

exports.getAllRole = async (req, res) => {
    try {
        const role = await Role.find();
        res.status(200).json(role);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) return res.status(404).json({ message: "Role not found!!!" })
        console.log("Role not found with ID:", req.params.id);
        res.status(200).json(role);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
