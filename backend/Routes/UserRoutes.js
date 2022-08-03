const express = require("express");
const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const GenerateToken = require('./JWT')
//////////////////////////////////////////////////////
const UserRoute = express.Router();
//////////////////////////////////////////////////////

////////////   SignUp   ////////////////////
UserRoute.post("/signup", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res.status(500).send({ message: "Should Have a Unique Email" });
    } 
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
      picture: req.body.picture,
    });

    if (newUser) {
      res.status(200).send({
        _id: newUser._id,
         name: newUser.name,
         email: newUser.email,
         picture: newUser.picture,
         status: newUser.status,
         token: GenerateToken(newUser)   
      });
    } else {
      res.status(500).send();
    }
  } catch (error) {
    res.send();
  }
});

////////////////////////////////////   LogIn   /////////////////////////////
UserRoute.post('/login' , async(req , res)=>{

  try {
    const user = await User.findOne({email:req.body.email})
    if(!user){
      res.send("Wrong Email or Password")
    }
    else{
      const password = await bcrypt.compareSync(req.body.password , user.password)
      if(password){
        user.status = 'online';
        await user.save();
        res.status(200).send({
          _id: user._id,
          name: user.name,
          email: user.email,
          picture: user.picture,
          status: user.status,
          token: GenerateToken(user)
        })
      }
      else{
        res.send("Wrong Email or Password")
      }
    }
    
  } catch (error) {
    res.status(500).send(error)
  }

    
})

module.exports = UserRoute;
