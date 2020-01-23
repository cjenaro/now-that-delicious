const mongoose = require('mongoose')
const slug = require('slugs')
mongoose.Promise = global.Promise

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a store name!',
  },
  description: {
    type: String,
    trim: true,
  },
  slug: String,
  tags: [String],
})

storeSchema.pre('save', function(next) {
  if (!this.isModified('name')) return next()
  this.slug = slug(this.name)
  next()
})

module.exports = mongoose.model('Store', storeSchema)
