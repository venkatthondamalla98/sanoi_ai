const express = require('express')
const cors = require("cors");

const products = require('./routes/products')

const app = express()

app.use(cors());
app.use(express.json({ limit: "500mb", extended: true }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));

app.use("/vtsanoi/api/products", products);

app.use("/vtsanoi", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is working and reachable",
  });
});


app.listen(4000, () => {
  console.log("Server is up and running on port 4000")
})