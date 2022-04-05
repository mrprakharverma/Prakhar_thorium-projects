const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    title:{ type:String, required:[true,'required title'], trim:true, enum:['Mr','Mrs','Miss'] },
    name:{ type:String, required:[true,'required name'], trim:true },
    phone:{ type:String, trim:true, unique:[true,'try other mobile number'], required:[true,"required mobile number"], pattern:"^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$" },
    email:{ type:String, required:[true,"required email"], trim:true, lowercase:true, 
    validate: { validator: function (email) { return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) },
              message: 'Please fill a valid email address',
              isAsync: false
            }
        },
    password:{ type:String, required:[true,"password required"], minlength:8, maxlength:15 },
    address:{ 
        street:{ type:String, trim:true },
        city:{ type:String, trim:true, },
        pincode:{ type:String, trim:true }
    },
},{timestamps:true})
module.exports = mongoose.model('user', userSchema)