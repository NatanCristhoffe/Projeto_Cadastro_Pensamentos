const User = require("../models/User")
const bcrypt = require("bcryptjs")

module.exports = class {
    static login(req, res) { 
        
        res.render("auth/login")
    }

    static async loginPost(req, res){
        const {email, password} = req.body

        //find user
        const user = await User.findOne({where: {email:email}})
        if(!user) {
            req.flash("message", "Usário não encontrado!")
            res.redirect("/login")
            return
        }
        //check if passwords match
        const passwordMatch = bcrypt.compareSync(password, user.password)
        if(!passwordMatch){
            req.flash("message", "Senha inválida!")
            res.redirect("/login")
            return
        }
        //Initialize session
        req.session.userid = user.id
        req.flash("message", "Seu login foi realizado com sucesso")
        req.session.save(() => {
            res.redirect("/")
        })
    }

    static register(req, res) { 
        
        res.render("auth/register")
    }

    static async registerPost(req,res) {
        const {name,email,password,confirmpassword} = req.body

        //password match validation
        if(password!=confirmpassword){
            req.flash("message", "As senhas sao diferentes, preencha novamente!")
            res.render("auth/register")
        }

        //check if user exists
        const checkUser = await User.findOne({where:{email:email}})

        if (checkUser) {
            req.flash("message", " O e-mail já está em uso!")
            res.render("auth/register")
            
            return
        }

        //create password
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            name,
            email,
            password: hashedPassword,
        }
        try{
            const createdUser = await User.create(user)

            //Initialize session
            req.session.userid = createdUser.id

            req.flash("message", "Seu cadastro foi realizado com sucesso")

            req.session.save(() => {
                res.redirect("/")
            })

           
        }catch(err){
            console.log(err)
        }
    }

    static logout(req,res){
        req.session.destroy()
        res.redirect("/login")
    }
}