const mongoose = require("mongoose");

async function connect() {
    try {
        await mongoose.connect("mongodb+srv://anhquan:121203@cluster0.q5rgy.mongodb.net/bookStore");
        console.log("Connect mongoDB successfully!!!")
    } catch (error) {
        console.log("Connect fail mongoDB", error)
    }
}

module.exports = {connect};