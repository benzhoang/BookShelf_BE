const Payment = require("../models/payment.model");

exports.getAllPayment = async (req, res) => {
    try {
        const payment = await Payment.find();
        res.status(200).json(payment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment)
            return res.status(404).json({ message: "Payment not found" });
        res.status(200).json(payment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.createPayment = async (req, res) => {
    try {
        const { method, methodName } = req.body;

        const newPayment = new Payment({
            method,
            methodName,
        });
        await newPayment.save();
        res.status(201).json({
            message: "Create new payment successfully",
            payment: newPayment,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndDelete(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: "Payment not found!!!" });
        } else {
            res.status(200).json({ message: "Delete payment successfully!!!" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};