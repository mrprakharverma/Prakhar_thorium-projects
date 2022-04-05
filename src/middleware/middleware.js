let jwt=require('jsonwebtoken')
let BlogsModel=require('../models/BlogsModel')

let mid1= function(req,res,next){
    try{
    let token=req.headers["x-api-key"]
    if(!token){return res.status(404).send({status:false,msg:"token required"})}
    
    let decodetoken=jwt.verify(token,'shubham kumar')
    if(!decodetoken){return res.status(401).send({status:false,msg:"you are not authenticated"})}
    next()}catch(err){res.status(500).send({error:err.message})}
}

let authorisation=async function(req,res,next){
    try{
    let blogId=req.params.blogId||req.query.blogId
    if(!blogId){return res.status(404).send({msg:"blogId not found"})}
    
    let token=req.headers["x-api-key"]
    if(!token){return res.status(404).send({status:false,msg:"token required"})}
    
    let decodetoken=jwt.verify(token,'shubham kumar')
    if(!decodetoken){return res.status(401).send({status:false,msg:"you are not authenticated"})}

    let authorId= await BlogsModel.findById(blogId).select({authorId:1})
    console.log(authorId)
    
    let Blogtobemodified=authorId.authorId
    console.log(Blogtobemodified)

    let Authorloggedin=decodetoken.authorId
    console.log(Authorloggedin)
    if(Blogtobemodified!=Authorloggedin){return res.status(403).send({msg:"Authorisation failed"})}
next()}
catch(err){res.status(500).send({error:err.message})}

}
module.exports.mid1=mid1
module.exports.authorisation=authorisation