const { response } = require('express')
const express = require('express')
const morgan = require('morgan')

const app = express()
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))

morgan.token('post',(req, res)=>{
  return(JSON.stringify(req.body))
})

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

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
  console.log(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)

  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const person = req.body

  if ((!person.name) || (!person.number)) {
    return res.status(400).json({
      error: 'name or number missing'
    })
  }

  if (persons.find(p => p.name === person.name)) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  let id = Math.floor(Math.random() * 10000000000)
  for (triedTime = 0; triedTime < 10; triedTime++) {
    if (persons.find(p => p.id === id)) {
      id = Math.floor(Math.random() * 10000000000000)
    }
    else {
      break;
    }
  }

  person.id = id
  persons = persons.concat(person)
  res.json(person)
//  console.log(person)
})

app.get('/info', (req, res) => {
  const info = `<p>Phonebook has info for ${persons.length} people</p>
    <p>${Date()}</p>`
  res.send(info)
  console.log('get /info')
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`start server on ${PORT}`)
})