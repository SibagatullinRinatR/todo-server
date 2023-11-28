const bcrypt = require("bcrypt")
const User = require ('../model/User')

class AuthController{

    async register(req, res){
        const user = new User({
            email: req.body.email,
            password: req.body.password
        })
        user.save().then(() => console.log("User created"))
       
        
    }
    async login(req, res){
        try{
            const{username, password} = req.body
        }catch(e){}
    }
    async getUsers(req, res){
        try{
            res.json("server work")
        }catch(e){}
    }

    async login(req, res){
        res.status(200).json({
            login:{
                email: req.body.email,
                password: req.body.password
            }
        }   
        )
    }
}

module.exports = new AuthController()