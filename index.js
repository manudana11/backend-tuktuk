const express = require("express")
const { dbConnection } = require("./config/config")
const app = express()
require("dotenv").config();
const cors = require('cors');

const PORT = process.env.PORT || 3000;

//error del cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
dbConnection()
app.use(express.json())


app.use('/users', require('./routes/users'));
app.use("/posts", require("./routes/posts"));
app.use("/comments", require("./routes/comments"));

app.listen(PORT, ()=> console.log(`Servidor levantado en el puerto ${PORT}`))

module.exports = app;
