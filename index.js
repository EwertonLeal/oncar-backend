const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

const app = express();

app.use(cors());

// LER JSON
app.use(
    express.urlencoded({
        extended: true
    }),
)

app.use(express.json());

// Rotas da API
const carRoutes = require("./routes/CarRoutes");
app.use("/car", carRoutes);

app.get("/", (req, res) => {

    res.json({ message: "Oi Express!" });

});

mongoose.connect("mongodb+srv://ewertonLeal:fb1nPrpNEtPxlsYj@cluster0.7mh0gcz.mongodb.net/?retryWrites=true&w=majority")
.then(() => {
    console.log("conectamos ao mongo db");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });

})
.catch((err) => console.log(err));
