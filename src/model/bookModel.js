const mongoose = require('mongoose')
const objectId = mongoose.Schema.Types.ObjectId

const bookSchema = new mongoose.Schema({
    title: { type: String, required: [true, "required title"], unique: true, trim: true },
    excerpt: { type: String, required: [true, "required excerpt"], trim: true,},
    bookCover : { type: String, required: true },
    userId: { type: objectId, required: [true, "required userId"], ref: 'user', trim: true },
    ISBN: { type: String, required: [true, "required Isbn"], unique: true, trim: true },
    category: { type: String, required: [true, "required category"], trim: true },
    subcategory: { type: String, required: [true, "required"], trim: true },
    reviews: { type: Number, default: 0, comment: { type: Number },trim: true},
    deletedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
    releasedAt: { type: Date, required: [true, "required date format(yyyy-mm-dd)"], default: Date.now(), format: 'YYYY-MM-DD' }
}, { timestamps: true })
module.exports = mongoose.model('book', bookSchema)