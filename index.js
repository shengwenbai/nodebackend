require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())

morgan.token('reqBody', function getBody(req) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] :reqBody'))

// let persons = [{
//         "id": 1,
//         "name": "Arto Hellas",
//         "number": "040-123456"
//     },
//     {
//         "id": 2,
//         "name": "Ada Lovelace",
//         "number": "39-44-5323523"
//     },
//     {
//         "id": 3,
//         "name": "Dan Abramov",
//         "number": "12-43-234345"
//     },
//     {
//         "id": 4,
//         "name": "Mary Poppendieck",
//         "number": "39-23-6423122"
//     }
// ]

app.get('/info', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.send(
        `<p>Phonebook has info for ${
          persons.length
        } people</p><p>${new Date()}</p>`
      )
    })
    .catch(error => next(error))
})

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => {
      res.json(persons.map(person => person.toJSON()))
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  //const id = Number(req.params.id)
  //const person = persons.find(person => person.id === id)
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
  // if (person) {
  //     res.json(person)
  // } else {
  //     res.status(404).end()
  // }
})

app.delete('/api/persons/:id', (request, response, next) => {
  //const id = Number(request.params.id)
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  //persons = persons.filter(person => person.id !== id)
  //response.status(204).end()
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  //查重
  // Person.find({}).then(persons => {
  //     console.log(typeof (persons), persons)
  //     if (persons.find(p => p.id === body.id)) {
  //         return response.status(400).json({
  //             error: 'name must be unique'
  //         })
  //     }
  // })

  // const person = {
  //     name: body.name,
  //     number: body.number,
  //     id: generateId(),
  // }
  // persons = persons.concat(person)
  // response.json(person)

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then(savedPerson => {
      response.json(savedPerson.toJSON())
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true
  })
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

const generateId = () => {
  //const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
  //return maxId + 1
  return Math.floor(Math.random() * 1000000)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({
    error: 'unknown endpoint'
  })
}

app.use(unknownEndpoint)

const errorHandeler = (error, request, response, next) => {
  console.log(error)
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({
      error: 'malformatted id'
    })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.message
    })
  }
  console.log(error)
  next(error)
}

app.use(errorHandeler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
