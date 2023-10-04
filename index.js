const express = require('express')
const app = express()

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.use(express.json())

app.get('/', (req, res) => {
  res.send('<p>Hey</p>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.post('/api/persons', (req, res) => {
  const { name, number} = req.body
  const nameExists = !!persons.find(p => p.name === name)
  if (!name || !number) {
    return res.status(400).send('Name or number missing.')
  }
  
  if (nameExists) {
    return res.status(400).send('This person already exists.')
  }
  const id = Math.floor(Math.random() * (100000000) + 1)
  person = {name, number, id}
  persons.push(person)
  res.status(201).send(person)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  if (!person) {
    return res.sendStatus(404)
  }
  res.json(person)
  return
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)
  res.status(204).send({})
})

app.get('/api/info', (req, res) => {
  res.send(`<p>The phonebook has ${persons.length} entries</p>
            <p>@${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}</p>`)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
