require('dotenv').config()


const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(cors())
app.use(express.json())

app.use(morgan('tiny'))

morgan.token('body', req => {
  return JSON.stringify(req.body)
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

app.use(express.static('dist'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    console.log('Hey', people)
    response.json(people)
  })
})

app.get('/info', (request, response) => {
  const currentTime = new Date()
  Person.countDocuments().then(numberOfPeople => {
    const page = `<p>Phonebook has ${numberOfPeople} people</p>
        <p>${currentTime}</p>`
    response.send(page)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id

  Person.findById(id).then(personFound => {
    if (!personFound) {
      response.status(404).end()
    } else {
      response.json(personFound)
    }
  })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })

  // const id = request.params.id
  // const personFound = data.find(person => person.id === id)
  // if (personFound) {
  //     response.json(personFound)
  // } else {
  //     response.status(404).end()
  // }
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id).then(person => {
    response.status(204).end()
  })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
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
  }).catch(error => {
    next(error)
  })
})


app.put('/api/persons/:id', (request, response) => {
  //new: true is important
  const id = request.paramds.id
  const personToUpdate = request.body

  Person.findByIdAndUpdate(id, personToUpdate, { new: true }).then(updatedPerson => {
    if (!updatedPerson) {
      return res.status(404).json({ message: 'Person not found' })
    } else {
      response.json(updatedPerson)
    }
  })
    .catch(error => {
      console.log(error)
      //i would return a status code here but idk what fits
    })
})


const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    console.log('Backend: It is a validation error')
    // console.log(error)
    return response.status(400).json({ error: error.message })
  }
  next (error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})




