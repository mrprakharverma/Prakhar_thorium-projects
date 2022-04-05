const { moment } = require('moment')
const mongoose = require('mongoose')
const objectId = mongoose.Schema.Types.ObjectId

const reviewSchema = new mongoose.Schema({

    bookId: { type: objectId, required: [true, "required bookId"], ref: 'book', trim:true },
    reviewedBy: { type: String, required: [true, "required data"], default: 'Guest', trim:true },
    reviewedAt: { type: Date, required: [true, 'required date'], default:Date.now() },
    rating: { type: Number, min: 1, max: 5, required: [true, 'required rating'], trim:true },
    review: { type:String, trim:true },
    isDeleted: { type: Boolean, default: false }
})
module.exports = mongoose.model('reviews', reviewSchema)