const collegemodel = require("../models/collegemodel");
const internmodel = require("../models/internmodel")
let validator =require("email-validator");

const college = async function (req, res) {
    try {
         let college = req.body
         if (Object.entries(college).length === 0) {
              res.status(400).send({ status: false, msg: "Kindly pass some data " })
         }
         else {
              let name = req.body.name
              if(!name)
              return res.status(400).send({status: false,msg:"Enter Valid name"})
              
              let fullName = req.body.fullName
              if(!fullName)
              return res.status(400).send({status: false,msg:"Enter Valid fullName"})
             
              let logolink = req.body.logoLink
              if(!logolink)
              return res.status(400).send({status: false,msg:"Enter Valid logoLink"})

              let data = await collegemodel.findOne({ name })
              if (data) {
                   return res.status(401).send({ status: false, msg: "Enter Unique name" })}

              let collegeCreated = await collegemodel.create(college)
              res.status(201).send({ status: true, data: collegeCreated })
         }
    }
    catch (error) {
         console.log(error)
         res.status(500).send({ status: false, msg: error.message })
    }

  };

const intern = async function (req, res) {
     try {
          let intern = req.body
          if (Object.entries(intern).length === 0) {
               res.status(400).send({ status: false, msg: "Kindly pass some data " })
          }
          else {
               let name = req.body.name
               if(!name)
               return res.status(400).send({status: false,msg:"Enter Valid name"})
               
               let email = req.body.email
               if(!email)
               return res.status(400).send({status: false,msg:"Enter Valid Email"})
 
               let check = validator.validate(email);
               if (!check) {
                    return res.status(401).send({ status: false, msg: "Enter a valid email id" }) } 
 
               let mail = await internmodel.findOne({ email })
               if (mail) {
                    return res.status(401).send({ status: false, msg: "Enter Unique Email Id." })}

               let  mobile = req.body.mobile
               if(!mobile)
               return res.status(401).send({status: false,msg:"Enter Valid mobilenumber"})

               if (!(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/.test(mobile))) {
                    res.status(400).send({status : false , msg : " enter valid mobileno."})
                    return 
                }

               let collegeId = req.body.collegeId
               let college = await collegemodel.findById(collegeId)
               if(!college){
                  res.status(400).send({status : false, msg:"No Such college is Present,Please check collegeId"})}
               
               let internCreated = await internmodel.create(intern)
               res.status(201).send({ status: true, data: internCreated })
          }
     }
     catch (error) {
          console.log(error)
          res.status(500).send({ status: false, msg: error.message })
     }
};

const getcollege = async function (req, res) {
     try{
         const collegeName = req.query.collegeName
      
         if(!collegeName){
              return res.status(400).send({status:false, msg:"BAD REQUEST please provied valid collegeName"})}

         const college =await collegemodel.find({ name:collegeName, isDeleted: false })
         if (!college) {
            return res.status(404).send({ status: false, msg: "BAD REQUEST  college not found" })
          }
           console.log(college)
          const collegeId = college[0]._id
          
            const interName = await internmodel.find({collegeId: collegeId, isDeleted : false})
            if(interName.length <= 0){
                 res.status(404).send({msg: `No intern apply for this college: ${college} `})}
            const interests =[]
      
            for (let i=0; i<interName.length;i++)
            {
                let Object={}
                Object._id = interName[i]._id
                Object.name=interName[i].name
                Object.email = interName[i].email
                Object.mobile=interName[i].mobile
                interests.push(Object)
            }
      
            const ObjectData = {
                name:college[0].name,
                fullName:college[0].fullName,
                logoLink:college[0].logoLink,
                interests:interests
            }
            
          return res.status(201).send({ status: true, count : interests.length, msg:ObjectData })
      
      
      }
      catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
      }
      }
module.exports.college=college
module.exports.intern=intern
module.exports.getcollege=getcollege