require('dotenv').config()
const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

const url = process.env.MONGO_URI

mongoose.connect(url)
  .then(() => console.log('mongoose connected'))
  .catch(error => console.log(error.message))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    required: true,
    minLength: 8,
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d/.test(v)
      }
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)