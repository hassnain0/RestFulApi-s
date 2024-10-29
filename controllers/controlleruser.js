const userModel = require('../models/userModel');


//Get All Data Function
async function getAllUsers(req, res) {
    const allUsersData = await userModel.find({});
    return res.json(allUsersData);
}

//Get Specific user by id:
async function getUserById(req, res) {
    const user = await userModel.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ msg: "Requested User not Exist" })
    }

    return res.json(user)
}

//Creating  New User
async function addUser(req, res) {
    const body = req.body;

    if (!body || !body.email || !body.first_name || !body.last_name || !body.email || !body.title || !body.gender) {
        return res.status(400).json({ msg: "All fields are required" })
    }

    await userModel.create({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        job_title: body.title,
        gender: body.gender,
    });

    return res.status(201).send("User Successfully Created");
}


//Update Specific User

async function updateUser(req, res) {
    await userModel.findByIdAndUpdate(req.params.id, { email: "none@mail.com" });
    res.status(200).json({ "msg": "Sucess" })
}

//Delete User by Id
async function deleteUser(req, res) {

    const response = await userModel.findByIdAndDelete(req.params.id);

    if (!response) {
        return res.status(404).json({ "msg": "User not exist" })
    }
    return res.send({ "msg": "sucess" })
}

//Exports all functions to main index.js File
module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    addUser,

}