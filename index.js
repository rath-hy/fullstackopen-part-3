const express = require('express')
const app = express()

//next task: automatic refresh
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
    const id = request.params.id //this is a string
    const personFound = data.find(person => person.id === id)
    if (personFound) {
        console.log('this runs?')
    } else {
        response.status(404).end()
    }
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)