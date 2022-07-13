const User = require("../models/user.model");

class UserController{
    //admin controller features for getting all users
    getAllUsers=(req,res)=>{
        User.find()
            .then(allUsers=>{
                res.json({results: allUsers})
            })
            .catch(err=>{
                res.json({error: err})
            })
    }

}

module.exports = new UserController();