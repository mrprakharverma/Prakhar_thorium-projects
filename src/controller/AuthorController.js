let AuthorModel = require("../models/Authormodel")
let jwt=require('jsonwebtoken')
const BlogsModel = require("../models/BlogsModel")

const isValid=function(value){
    if(typeof value==='undefined'|| value==='null'){return false}
    if(typeof value==='string'&& value.trim().length===0){return false}
    return true
}

const isvalidTitle=function(title){
    return['mr','miss','mrs'].indexOf(title)!==-1
}

const isvalidRequestbody=function (requestBody){
    return Object.keys(requestBody).length>0
}

let authors = async function (req, res) {
    try {
        const requestBody=req.body
        if(!isvalidRequestbody(requestBody)){
        return res.status(400).send({status:false,message:"invalid request parameter"})
    }
    
    const {firstname,lastname,title,email,password}=requestBody
    if(!isValid(firstname)){return res.status(400).send({status:false,message:"first name is required"})}
    if(!isValid(lastname)){return res.status(400).send({status:false,message:"last name is required"})}
    if(!isValid(title)){return res.status(400).send({status:false,message:"title is required"})}
    if(!isvalidTitle(title)){return res.status(400).send({status:false,message:"this title is not allowed"})}
    if(!isValid(password)){return res.status(400).send({status:false,message:"password is required"})}
  
    const isemailAlreadyUsed=await AuthorModel.findOne({email})
    if(isemailAlreadyUsed){return res.status(400).send({status:false,message:'email is already registred'})}
    
        var validateEmail = function (email) {
            var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return re.test(email)
        };
        if (!validateEmail) { return res.status(400).send({ msg: "invalid email" }) }
      
        let savedData = await AuthorModel.create(requestBody)
        res.status(201).send({ msg: savedData })

    }
    catch (err) { res.status(500).send({ msg: err.message }) }
}
// ============================================================================================ //
let loginuser=async function(req,res){
    try{
        let username=req.body.email
        if(!username){return res.status(400).send("Bad request")}
        
        let password=req.body.password
        if(!password){return res.status(400).send("Bad request")}
        
        let savelogin=await AuthorModel.findOne({email:username,password:password})
        if(!savelogin){return res.status(404).send({msg:"user with this username and password not found"})}
        
        
let token=await jwt.sign({authorId:savelogin._id},'shubham kumar')
res.setHeader("x-api-key",token)
res.status(201).send({status:true,data:token})


    }
    catch(error){res.status(500).send({error:error.message})}
}

module.exports.authors = authors
module.exports.loginuser=loginuser