require('dotenv').config(); 
const Person = require('./models/person')

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

app.use(morgan('tiny'));

morgan.token('body', req => {
    return JSON.stringify(req.body)
})

app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.use(express.static('dist'))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
        response.json(people);
    })
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
    Person.findById(request.params.id).then(person => {
        response.json(note)
    }) 
})

app.post('/api/persons', (request, response) => {
    const body = request.body 

    if (body.name === undefined) {
        return response.status(400).json({ error: 'name missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

