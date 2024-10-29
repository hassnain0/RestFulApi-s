const mongoose = require('mongoose');

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

module.exports = usermodel;