//node will use this file and be the interpreter
//this file sets up a simple server using express

//allows us to use express
const express = require("express");

//gives us back app object that we can then configure however we want
const app = express();


//adding a new route on to app object
    //listens for requests on first arg passed, second arg is a func that handles the request to the first arg
app.get("/", (req, res) => {
    res.send("Hello World!");
});

//define our port
const port = process.env.PORT || 5000;

app.listen(port, () => {console.log(`Listening on port ${port}`)});