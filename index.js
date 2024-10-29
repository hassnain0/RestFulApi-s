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
        required: true,
    },
    last_name: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    job_title: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    }
});


const usermodel = mongoose.model("user", userSchema);


app.get('/users', (req, res) => {

    //Creating html tag for rendering Data using Template String
    const html = `<ul>${users.map((data) => `<li>${data.first_name}</li>`).join("")}</ul>`
    return res.send(html)
})


//Get All Users for front end:

// //Creating MiddleWare
// app.use((req,res,next)=>{
//     console.log("Calling Next Middle ware");
//     next();
// })
app.use(express.json());


app.get('/api/users', (req, res) => {
    return res.json(users)
});

//Creating New User:
app.post("/api/users", async(req, res) => {


    const body = req.body;

    if (!body || !body.email || !body.first_name || !body.last_name || !body.email || !body.title || !body.gender) {
        return res.status(400).json({ msg: "All fields are required" })
    }
    
   await usermodel.create({
        first_name:body.first_name,
        last_name:body.last_name,
        email:body.email,
        job_title:body.title,
        gender:body.gender,
    });

    return res.status(201).send("User Successfully Created");
})

app.route('/api/users/:id')
    .get((req, res) => {
        const id = Number(req.params.id);

        console.log("Id", id)
        const user = users.find((user) => user && user.id === id);
        if (!user) {
            return res.status(404).json({ msg: "Requested User not Exist" })
        }

        return res.json(user)
    })
    .patch((req, res) => {

        const email = req.body.email;
        const id = req.params.id;
        const findtoDobyId = (todos, id) => {

            for (let i = 1; i < todos.length; i++) {
                if (todos[i].id === parseInt(id)) {
                    return i;
                }
            }

        }

        try {

            fs.readFile('./MOCK_DATA.json', 'utf-8', (er, data) => {
                if (er) {
                    return res.status(404).send("Data not found");
                }

                // Parse and send the data
                try {
                    let todos = JSON.parse(data);
                    const todoIndex = findtoDobyId(todos, id);

                    todos[todoIndex].email = email;

                    fs.writeFile('./MOCK_DATA.json', JSON.stringify(todos), () => {
                        return res.json({ 'status': 'ok' })
                    })
                }
                catch (parseErr) {
                    res.status(500).send("Error parsing JSON data");
                }
            })
        }
        catch (err) {
            console.log("Error", err)
        }


    })
    .delete(("/api/users/:id", (req, res) => {


        const id = Number(req.params.id);
        fs.readFile('./MOCK_DATA.json', 'utf-8', (er, data) => {
            if (er) {
                return res.status(404).send("Data not found");
            }

            const findtoDobyId = (todos, id) => {

                for (let i = 1; i < todos.length; i++) {
                    if (todos[i].id === parseInt(id)) {
                        return i;
                    }
                }

            }

            let jsonData = JSON.parse(data);
            let index = findtoDobyId(jsonData, id);

            let deletedData = jsonData.splice(index, 1);

            fs.writeFile('./MOCK_DATA.json', JSON.stringify(deletedData), () => {
                return res.json({ 'status': 'ok' })
            })
        })
    }))


//Getting params from user and display
const PORT = 3000;

app.listen(PORT, () => { console.log("Server is me and running on http://localhost:" + PORT) })
