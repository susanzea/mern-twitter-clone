const express = require("express");
//gets a router obj off of the router
const router = express.Router();
const User = require("../../models/User");
//add bcrypt so we can hash passwords and generate salt
const bcrypt = require("bcryptjs");
const keys = require("../../config/keys");
const jwt = require('jsonwebtoken');
const passport = require('passport');
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

router.get("/test", (req, res) => {
    res.json({ msg: "This is the user route "})
})

router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email })
    .then(user => {
        if (user) {
            return res.status(400).json({email: "A user is already registered with that email"})
        } else {
            const newUser = new User({
                handle: req.body.handle,
                email: req.body.email,
                password: req.body.password
            })

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then((user) => res.json(user))
                        .catch(err => console.log(err))
                } )
            })
        }
    })
})


//setting up login route
router.post("/login", (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }


    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email }) //same as { email: email }
        .then(user => {
            if ( !user) {
                //let frontend know that user doesn't exist
                return res.status(404).json({ email: "This user does not exist." });
            }

            //if we've made it this far, we have a user
            bcrypt.compare(password, user.password)
                //line above returns a promise that's a boolean which we assign as isMatch below
                .then(isMatch => {
                    if (isMatch) {
                        //creating payload of user info to send back
                        const payload = {
                            //mongodb id
                            id: user.id,
                            handle: user.handle,
                            email: user.email
                        }
                        jwt.sign(
                            payload, 
                            keys.secretOrKey, 
                            {expiresIn: 3600},
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: "Bearer" + token
                                });
                            }
                        )
                    } else {
                        return res.status(400).json({ password: "Incorrect password" });
                    }
    
                })
        })
})


module.exports = router;