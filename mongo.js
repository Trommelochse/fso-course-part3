const mongoose = require('mongoose')

const mongoPass = process.env.MONGO_PW

const url =
  `mongodb+srv://clemensajanes:${mongoPass}@testcluster.aqhxr4p.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 3) {
 Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}

const name = process.argv[2]
const number = process.argv[3]

const person = new Person({ name, number })

person.save().then(result => {
  console.log('entry added')
  mongoose.connection.close()
})