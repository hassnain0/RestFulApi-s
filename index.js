const express = require('express');
const app = express();
const { connectDb } = require('./connection');
const router = require('./routes/user')

connectDb("mongodb://127.0.0.1:27017/user");

app.use("/api/users", router)
//Getting params from user and display
const PORT = 3000;

app.listen(PORT, () => { console.log("Server is me and running on http://localhost:" + PORT) })
