//node will use this file and be the interpreter
//this file sets up a simple server using express

//allows us to use express
const express = require("express");
//gives us back app object that we can then configure however we want
const app = express();
//require mongoose
const mongoose = require("mongoose");
//gives us access to our db
const db = require("./config/keys").mongoURI
const users = require("./routes/api/users")
const tweets = require("./routes/api/tweets")
//import user model
const User = require("./models/User");
const bodyParser = require("body-parser");

//connect mongoose to db. first arg is the URI and the second is the config object
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log("connected to mongoDB"))
    .catch(err => console.log(err))

//tells app that it can also respond to requests from other software like Postman
app.use(bodyParser.urlencoded({
    extended: false
}));

//tells app to respond to JSON requests
app.use(bodyParser.json());


//adding a new route on to app object
    //listens for requests on first arg passed, second arg is a func that handles the request to the first arg
app.get("/", (req, res) => {
    const user = new User({
        handle: "jim",
        email: "jim@jim.jim",
        password: "jimisgreat123"
    })
    user.save()
    console.log(res);
    res.send("Hello World!");
});

app.use("/api/users", users);
app.use("/api/tweets", tweets);

//define our port
const port = process.env.PORT || 5000;

app.listen(port, () => {console.log(`Listening on port ${port}`)});