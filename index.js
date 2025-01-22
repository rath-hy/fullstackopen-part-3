const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

app.use(morgan('tiny'));

morgan.token('body', req => {
    return JSON.stringify(req.body)
})

app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms :body')
);


const data = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(data)
})

app.get('/info', (request, response) => {
    const currentTime = new Date();
    console.log(currentTime.toString());
    const page = `<p>Phonebook has ${data.length} people</p>
                    <p>${currentTime}</p>`
    response.send(page);
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const personFound = data.find(person => person.id === id)
    if (personFound) {
        response.json(personFound)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    data.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const entry = request.body
    entry.id = String(Math.round((Math.random() * 100)))
    const alreadyExists = data.some(person => person.name === entry.name)

    if (entry.name && entry.number && !alreadyExists) {
        console.log('Success', entry)
        response.json(entry)
    }

    if (!entry.name) {
        response.statusMessage = 'Missing name'
    } else if (!entry.number) {
        response.statusMessage = 'Missing number'
    } else if (alreadyExists) {
        response.statusMessage = 'Name must be unique'
    }

    response.status(400).end()
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)