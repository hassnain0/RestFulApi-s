const mongoose = require('mongoose');

async function connectDb(url) {
    return await mongoose.connect(url).then(() => console.log("DataBase Connected")).catch((er) => {
        console.log(er)
    });
};

module.exports = {
    connectDb
}