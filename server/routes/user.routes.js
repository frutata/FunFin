const UserController = require("../controllers/user.controller");

module.exports = (app)=>{
    //admin routes for viewing all users in system and deleting user accounts
    app.get("/funfin/users", UserController.getAllUsers)
    app.post("/funfin/users/register", UserController.register)
    app.post("/funfin/users/login", UserController.login)
    app.get("/funfin/users/getloggedinuser", UserController.getLoggedInUser)
    app.get("/funfin/users/logout", UserController.logout)
}