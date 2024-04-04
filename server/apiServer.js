const express = require("express");
const jsonwebtoken = require("jsonwebtoken");

const JWT_SECRET = "aVeryVerySecretString";
const myapp = express();

myapp.use(express.json());

myapp.post("/signin", (req, res) => {
    const {uname, pwd} = req.body;
    if(uname === "user" && pwd === "password") {
        return res.json({
            token: jsonwebtoken.sign({ user: "user" }, JWT_SECRET),
        });
    }
    return res
        .status(401)
        .json({ message: "Invalid username and/or password"});
});

myapp.get("/employees", (req, res) => {
    let tkn = req.header('Authorization');
    if(! tkn) return
        res.status(401).send("No Token");
    if(tkn.startsWith('Bearer ')) {
        tokenValue = tkn.slice(7, tkn.length).trimLeft();
    }
    const verificationStatus = jsonwebtoken.verify(tokenValue,"aVeryVerySecretString");
    if( verificationStatus.user === "user"){
        return res.status(200).json({ message: "Access Successful to Employee Endpoint"});
    }
    return res
        .status(401)
        .json({ message: "Please login to access this resource" });
});

myapp.listen(5000, () => {
    console.log("API Server is localhost:5000");
});