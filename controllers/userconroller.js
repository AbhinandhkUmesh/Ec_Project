const user = require('../models/usermodel')
const bcrypt = require('bcrypt')

const addUser = async (req,res) => {
    const nameExist = await user.findOne({email:req.body.email})

    try{
        if(nameExist){
            res.redirect("/signup?message=user name alreaddy exists")
            console.log(nameExists)
        }
        else{
            const hashedpassword = await bcrypt.hash(req.body.password,10)
            const newUser = new user({
                username:req.body.username,
                password:hashedpassword,
                email:req.body.email,
                isAdmin:0
            })
            await newUser.save()
            res.redirect('/login')
        }
    }
    catch(e){
        console.log(e.message)
    }
}

const checkUserIn = async (req,res) => {
    try {
        const checkUser = await user.findOne({email:req.body.email})
        console.log(checkUser)
        if(checkUser){
            const checkPass = await bcrypt.compare(req.body.password,checkUser.password)
            console.log('usernotfound')
            if(checkPass){
                req.session.isAuth = true
                req.session.email =  checkUser.email
                console.log("success")
                res.redirect('/index')
            }
            else{
                res.redirect(`/?errpassword=invalid password`)
            }
        }
        else{
            res.redirect(`/?errusername=invalid username`)
        }
    }
    catch(error){
        res.redirect('/error?message= something went wrong while logging!')
    }

}

const userExit = async (req, res) => {
    console.log(" user session destroyed 1")
    await req.session.destroy()
    console.log("user session destroyed 2")
    res.redirect("/")
}




module.exports = { checkUserIn, addUser, userExit }
