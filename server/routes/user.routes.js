const UserController = require("../controllers/user.controller");

module.exports = (app)=>{
    //admin routes for viewing all users in system and deleting user accounts
    app.get("/funfin/users", UserController.getAllUsers)
}