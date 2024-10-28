const express = require('express');

const users = require("./MOCK_DATA.json");
const app = express();


//Get All Users:

app.get('/users',(req,res)=>{
    return res.json(users)
})
const PORT = 3000;

app.listen(PORT, () => { console.log("Server is me and running on http://localhost:"+PORT) })
