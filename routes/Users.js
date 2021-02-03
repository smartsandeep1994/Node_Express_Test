const express = require('express')
const users = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const User = require('../models/User')
require("dotenv/config");
users.use(cors())

process.env.SECRET_KEY = 'secret'

users.get('/',(req,res)=>{
  res.send("please use post routes http://localhost:5000/users/login or http://localhost:5000/users/register");
});

users.post('/admin/register', (req, res) => {
    const today = new Date()
    var coupon = today.getTime();
    console.log(coupon);

    const userData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        created: today,
        invite_code:coupon,
        referal_code:req.body.referal_code,
        point:0,
        role:"admin"
    }

    User.findOne({
        email: req.body.email
    })
    .then(user => {
        if (!user) {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
              userData.password = hash
              User.create(userData)
                  .then(user => {
                      res.json({ status: user.email + '    Registered!' })
                  })
                  .catch(err => {
                      res.send('error: ' + err)
                  })
            })
        } else {
            res.json({ error: 'User already exists' })
        }
    })
    .catch(err => {
        res.send('error: ' + err)
    })
})

users.post('/register', async  (req, res) => {
    const today = new Date()
    const coupon = today.getTime();
    console.log(coupon);
    const referal_code = req.body.referal_code;

    const userData = {
        first_name: req.body.first_name,
        last_name:  req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        created: today,
        invite_code:coupon,
        referal_code:referal_code,
        point:0,
        role:"user"
    }

    let ExistingUser = await User.findOne({ email: req.body.email });
    

    if (!ExistingUser) {
        let checkInvite_code = await User.findOne({ invite_code: req.body.referal_code });
        console.log(typeof(checkInvite_code.point));
        let updatedPoint =  checkInvite_code.point + 5;
        console.log(updatedPoint);
        
        // res.json({ checkInvite_code: updatedPoint })
        let updatedData  =  await User.findOneAndUpdate({ invite_code: req.body.referal_code },{ $set: { "point" : updatedPoint}} )
        
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            userData.password = hash;
            User.create(userData)
            .then(user => {res.json({ status: user.email + '    Registered!'}) })
            .catch(err => { res.send('error: ' + err)});
        })
    }
    else {
        res.json({ error: 'User already exists' })
    }
});

users.post('/login', (req, res) => {
    console.log(req.body);
    // expiresIn: 1440 => expires in 24 hours
    User.findOne({
        email: req.body.email
    })
    .then(user => {
        if (user) 
        {
            if (bcrypt.compareSync(req.body.password, user.password)) {
              const role  = user.role;
              const token = jwt.sign({email:user.email,id:user._id},process.env.JWT_KEY,{expiresIn:"1h" });
                // res.json({ role: role })
                // console.log(user.email);
                // console.log(user.role);
                // console.log(user.first_name);
                // let token = jwt.sign(user, process.env.SECRET_KEY, {expiresIn: 1440})
                
                res.json({ token: token,role:role })
                // res.json({ token: token })
                
            }
            else
            {
                res.status(400).json({ error: 'password mismatched' })
            }
        } 
        else 
        {
            res.status(400).json({ error: 'User does not exist' })
        }
    })
    .catch(err => {
        res.status(400).json({ error: err })
    })
})

users.get("/user_data", async (req,res)=>{
    let token = req.headers['token'];
    
    if (!token){
		return res.status(403).send({ 
			auth: false, message: 'No token provided.' 
		});
    }
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
		if (err){
			return  res.status(500).send({ 
                        auth: false, 
                        message: 'Fail to Authentication. Error -> ' + err 
				    });
		}
        req.userId = decoded.id;
        // console.log(token);
        // console.log(req.userId);
        User.findOne({
            _id: req.userId
        })
        .then(user => {
            if (!user) {
                res.json({ status: "no data found for this user" })
            } else {
                var role=user.role;
                console.log(role);
                if(user.role=='user'){
                    res.json({ first_name: user.first_name,last_name:user.last_name,email:user.email,role:user.role })
                }
                else if(user.role=='admin'){
                    User.find({}, { first_name: 1,last_name:1,email:1,role:1 }, function(err, result) {
                        if (err) {
                          console.log(err);
                        } else {
                          res.json(result);
                        }
                    });
                }
                else if(user.role=='superadmin'){
                    User.find({}, { first_name: 1,last_name:1,email:1,role:1 }, function(err, result) {
                        if (err) {
                          console.log(err);
                        } else {
                          res.json(result);
                        }
                    });
                }
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })	
    });
});

module.exports = users