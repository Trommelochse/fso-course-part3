const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const Person = require('./models/person')

const app = express()

/* Body Parser & CORS */
app.use(express.json())
app.use(cors())

/* Deliver Frontend */
app.use(express.static('dist'))

/* Log requests */
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :response-time ms - :body'))

/* Routes */
app.get('/', (req, res) => {
  res.send('<p>Hey. Use /api/persons to get phone numbers.</p>')
})

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(people => {
      res.json(people)
    })
})

app.post('/api/persons', (req, res) => {
  const { name, number} = req.body

  if (name === undefined || number === undefined) {
    return res.status(400).send('Missing name or number')
  }

  const person = new Person({name, number})
  person.save().then(newPerson => {
      res.status(201).send(newPerson)
    })
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id)
    .then(person => {
      res.json(person)
    })
})

/** deleting and info not working */
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)
  res.status(204).send({})
})

app.get('/api/info', (req, res) => {
  res.send(`<p>The phonebook has ${persons.length} entries</p>
            <p>@${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}</p>`)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
