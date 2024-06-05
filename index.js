const express = require("express")
const { dbConnection } = require("./config/config")
const app = express()
require("dotenv").config();
const cors = require('cors');

const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: 'http://localhost:5173', // Reemplaza con tu dominio
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

dbConnection()
app.use(express.json())


app.use('/users', require('./routes/users'));
app.use("/posts", require("./routes/posts"));
app.use("/comments", require("./routes/comments"));

app.listen(PORT, () => console.log(`Servidor levantado en el puerto ${PORT}`))

module.exports = app;
