/* Its a helper file to populate initail data to Database*/

// importing dependencies
require("dotenv").config()
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true}) // Getting Database Connection

// Importing database models
const Admin = require("./Database/Admin");
const Customer = require("./Database/Customer")

// 9jhl52yk0orKVBP2LBYXFJ
// 8081haj1khs112FM495QMZF
create("occupymars133@gmail.com", "123456", Admin );


// functions to create Users in databases
async function create(email, password, database) {
    const emailExits = await database.exists({email: email})
    if (!emailExits) {
        const hash = hashPassword(password)
        const user = await database.create({email: email, password: hash});
        console.log(user)
    }else{
        console.log("User Already Exists in Specified DB")
    }
}

// Helper functions
function hashPassword(plainPassword) {
    const saltRounds = 10;
    const hash = bcrypt.hashSync(plainPassword, saltRounds);
    return hash;
}

//5fmy9u05l72SYHPBVE1AZI

