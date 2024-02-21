const mongoose = require("mongoose");

const Car = mongoose.model("Car", {
    brand: String,
    model: String,
    description: String,
    price: Number,
    year: Number,
    fuel: String,
    color: String,
    kilometers: Number,
    numOfDoors: Number,
    carPhoto: String
})

module.exports = Car