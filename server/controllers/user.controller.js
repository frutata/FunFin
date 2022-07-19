const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class UserController {

    //for testing to make sure server is running properly
    test = (req, res) => {
        res.json({
            msg: "testing funfin project"
        })
    }

    //admin controller features for getting all users
    getAllUsers = (req, res) => {
        User.find()
            .then(allUsers => {
                res.json({ results: allUsers })
            })
            .catch(err => {
                res.json({ error: err })
            })
    }

    //talks to model and creates using information with the form
    register = (req, res) => {
        User.find({ email: req.body.email })
            .then(matchingEmail => {
                console.log("response when user has same email", matchingEmail)
                //if user has email that hasn't been used before we allow them to continue
                if (matchingEmail.length === 0) {
                    User.create(req.body)
                        .then(user => {
                            //when the .then() happens that means that the user from the form was successfully created and is stored in that variable "user" which has info about the user that was just put into the db, including the field _id
                            const userToken = jwt.sign({
                                id: user._id,
                                username: user.username
                            }, process.env.SECRET_KEY);//has to match secret key name

                            res
                                .cookie("usertoken", userToken, process.env.SECRET_KEY, {
                                    httpOnly: true
                                })
                                .json({ msg: "success!", user: user });
                        })
                        .catch(err => res.json(err));
                }
                else{
                    //display message email is already taken
                    res.json({errors:{email:{message:"Email is taken!"}}})
                }
            })
            .catch(err => {
                console.log("error!", err)
            })

    }

    login = async (req, res) => {
        const user = await User.findOne({ email: req.body.email });//see if the user exists in the db

        if (user === null) {
            // email not found in users collection
            return res.json({error:"User not found"});
        }

        // if we made it this far, we found a user with this email address
        // let's compare the supplied password to the hashed password in the database
        const correctPassword = await bcrypt.compare(req.body.password, user.password);

        if (!correctPassword) {
            // password wasn't a match!
            return res.json({error:"Password is incorrect"});
        }

        // if we made it this far, the password was correct
        const userToken = jwt.sign({
            id: user._id,
            username: user.username
        }, process.env.SECRET_KEY);//has to match what secret key name NOT what the secret key is

        // note that the response object allows chained calls to cookie and json
        res
            .cookie("usertoken", userToken, process.env.SECRET_KEY, {
                httpOnly: true
            })
            .json({ msg: "success!" });
    }

    logout = (req, res) => {
        res.clearCookie('usertoken');
        res.sendStatus(200);
    }

    getLoggedInUser = (req,res)=>{
        //use the info stored in the cookie to get the id of the logged in user and query the db to find a user with that id and return with info about the logged in user
        const decodedJWT = jwt.decode(req.cookies.usertoken, {complete:true})
        User.findOne({_id: decodedJWT.payload.id})
            .then(foundUser=>{
                res.json({results: {username: foundUser.username}})
            })
            .catch(err=>{
                res.json(err)
            })
    }

}

module.exports = new UserController();