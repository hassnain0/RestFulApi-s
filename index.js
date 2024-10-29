const express = require('express');

const users = require("./MOCK_DATA.json");
const app = express();
const fs = require('fs');

const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/user').then(() => console.log("DataBase Connected")).catch((er) => {
    console.log(er)
})

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,

    },
    last_name: {
        type: String,

    },
    email: {
        type: String,
    },
    job_title: {
        type: String,

    },
    address: {
        type: String,

    }
},
    {
        timestamps: true,
    });


const usermodel = mongoose.model("user", userSchema);


app.get('/users', async (req, res) => {

    const allUsersData = await usermodel.find({});
    //Creating html tag for rendering Data using Template String
    const html = `<ul>${allUsersData.map((data) => `<li>${data.first_name} - ${data.email}</li> <br/>`).join("")}</ul>`
    return res.send(html)
})


//Get All Users for front end:

// //Creating MiddleWare
// app.use((req,res,next)=>{
//     console.log("Calling Next Middle ware");
//     next();
// })

app.use(express.urlencoded({ extended: false }))
app.use(express.json());


app.get('/api/users', async (req, res) => {
    const allUsersData = await usermodel.find({});

    return res.json(allUsersData);
});

//Creating New User:
app.post("/api/users", async (req, res) => {


    const body = req.body;

    if (!body || !body.email || !body.first_name || !body.last_name || !body.email || !body.title || !body.gender) {
        return res.status(400).json({ msg: "All fields are required" })
    }

    const result = await usermodel.create({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        job_title: body.title,
        gender: body.gender,
    });

    return res.status(201).send("User Successfully Created");
})

app.route('/api/users/:id')
    .get(async (req, res) => {

        const user = await usermodel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: "Requested User not Exist" })
        }

        return res.json(user)
    })
    .patch(async(req, res) => {
        await usermodel.findByIdAndUpdate(req.params.id,{email:"none@mail.com"});
        res.send({"msg":"Sucess"})
        })
    .delete(("/api/users/:id",async (req, res) => {

        await usermodel.findByIdAndDelete(req.params.id)
    }))


//Getting params from user and display
const PORT = 3000;

app.listen(PORT, () => { console.log("Server is me and running on http://localhost:" + PORT) })
