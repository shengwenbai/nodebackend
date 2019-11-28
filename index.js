const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

const requestLogger = (request, response, next) => {
    console.log('========Request Info=======')
    console.log('Method: ', request.method)
    console.log('Path: ', request.path)
    console.log('Body: ', request.body)
    console.log('===========================')
    next()
}

app.use(requestLogger)

let persons = [{
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

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
})

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
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
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

    if (persons.find(p => p.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }
    persons = persons.concat(person)
    response.json(person)
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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})