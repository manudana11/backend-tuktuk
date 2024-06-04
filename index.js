const express = require("express")
const { dbConnection } = require("./config/config")
const app = express()
require("dotenv").config();
const cors = require('cors');

const PORT = process.env.PORT || 3000;

dbConnection()
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173/'
}));
app.use('/users', require('./routes/users'));
app.use("/posts", require("./routes/posts"));
app.use("/comments", require("./routes/comments"));

app.listen(PORT, ()=> console.log(`Servidor levantado en el puerto ${PORT}`))

module.exports = app;
