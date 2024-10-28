const express = require('express');

const users = require("./MOCK_DATA.json");
const app = express();

const fs = require('fs');


app.get('/users', (req, res) => {

    //Creating html tag for rendering Data using Template String
    const html = `<ul>${users.map((data) => `<li>${data.first_name}</li>`).join("")}</ul>`
    return res.send(html)
})


//Creating MiddleWare for data

// app.use(express.urlencoded({ extended: false }))
// //Get All Users for front end:

// //Creating MiddleWare
// app.use((req,res,next)=>{
//     console.log("Calling Next Middle ware");
//     next();
// })

app.use((req,res,next)=>{
    fs.appendFile("userdefined.txt",`File was created at${Date.now()}: ${req.method} :${req.path}`,(err,data)=>next())
})


app.get('/api/users', (req, res) => {
    return res.json(users)
});

//Creating New User:
app.post("/api/users", (req, res) => {
    const body = req.body;
    users.push({ id: users.length + 1, ...body });
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => { })
    return res.json({ status: 'Sucess' })
})

app.route('/api/users/:id')
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find((user) => user.id === id);
        return res.json(user);
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

        
        const id =Number(req.params.id);
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
    
            let jsonData=JSON.parse(data);
            let index=findtoDobyId(jsonData,id);

            let deletedData=jsonData.splice(index,1);
    

            

            
                fs.writeFile('./MOCK_DATA.json', JSON.stringify(deletedData), () => {
                    return res.json({ 'status': 'ok' })
                })
                    })
    }))


//Getting params from user and display
const PORT = 3000;

app.listen(PORT, () => { console.log("Server is me and running on http://localhost:" + PORT) })
