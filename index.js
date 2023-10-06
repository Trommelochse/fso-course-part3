require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const Person = require('./models/person')

const app = express()

/* Body Parser & CORS */
app.use(express.json())
app.use(cors())

/* Deliver Frontend */
//app.use(express.static('dist'))

/* Log requests */
morgan.token('body', (req) => JSON.stringify(req.body))
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

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  if (name === undefined || number === undefined) {
    return res.status(400).send('Missing name or number')
  }

  const person = new Person({ name, number })
  person.save()
    .then(newPerson => {
      res.status(201).send(newPerson)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      res.json(person)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).send()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const person = { ...req.body }
  Person.findByIdAndUpdate(req.params.id, person, {
    new: true,
    runValidators: true,
    context: 'query'
  })
    .then(updatedPerson => {
      res.status(201).json(updatedPerson)
    })
    .catch(error => next(error))
})

app.get('/api/info', (req, res) => {
  Person.find({})
    .then(people => {
      res.send(`<p>The phonebook has ${people.length} entries</p>
                <p>@${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}</p>`)

    })
})

const errorHandler = (error, req, res, next) => {
  console.log(error.message)
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    res.status(400).send(error.message)
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
