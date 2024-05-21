const sequelize = require("../db/conn")
const Tought = require("../models/Tought,")
const User = require("../models/user")
const {Op} = require("sequelize")

module.exports = class ToughtsController {
    static async showToughts (req,res) {

        let search = ""
        if(req.query.search){
            search = req.query.search
        }

        let order = "DESC"
        if(req.query.order === "old"){
            order = "ASC"
        } else {
            order = "DESC"
        }

        const toughtsData = await Tought.findAll({
            include:User,
            where: {
                title: {[Op.like]: `%${search}%`},
            },
            order: [["createdAt", order]]
        })
        const toughts = toughtsData.map((result) => result.get({plain:true}))

        let toughtsQty = toughts.length
        if(toughts === 0) {
            toughts = false
        }
        res.render("toughts/home",{toughts, search, toughtsQty})
    }

    static async dashboard(req,res){
        const userId = req.session.userid
        if(!userId){
            res.redirect("/login")
            return
        }

        const user = await User.findOne({
            where: {
                id:userId,
            },
            include:Tought,
            plain:true,
        })
        //check if user exist
        if(!user){
            res.redirect("/login")
            return
        }
        const toughts = user.Toughts.map((result) => result.dataValues)

        let empyToughts = false
        if(toughts.length === 0 ) {
            empyToughts = true
        }


        res.render("toughts/dashboard", {toughts, empyToughts})
    }


    static async createTought(req,res){
        res.render("toughts/create")
    }

    static async createToughtSave(req, res) {
        const tought = {
            title: req.body.title,
            UserId: req.session.userid,
        }
        try {
            await Tought.create(tought)
            req.flash("message", "Pensamento salvo com sucesso!!")
            await req.session.save() // Salva a sessão antes do redirecionamento
            res.redirect("/toughts/dashboard")
        } catch (err) {
            console.log(err)
        }
    }
    

    static async removeTought(req,res){
        const id = req.body.id
        const UserId = req.session.userid

        try{
            await Tought.destroy({where: {id: id, UserId: UserId}})
            req.flash("message", "Pensamento excluida com sucesso!")
            req.session.save(() => {
                res.redirect("/toughts/dashboard")
            })
        } catch(error) {
            console.log("Aconteceu um erro: " + error)
        }
    }

    static async updateTought(req, res) {
        const id = req.params.id

        const tought = await Tought.findOne({where: {id: id}, raw: true})
        console.log(tought)
        res.render("toughts/edit", { tought })
    }

    static async updateToughtSave(req,res){
        const id = req.body.id

        const tought = {
            title: req.body.title,
        }
        try{
            await Tought.update(tought, {where: {id: id}})
            req.flash("message", "Pensamento atualizado com sucesso!!")

            req.session.save(() => {
            res.redirect("/toughts/dashboard")
        })

        }catch(error){
            console.log("ERRO -->>" + error)
        }
    }
}
