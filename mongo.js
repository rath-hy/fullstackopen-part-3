const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = encodeURIComponent(process.argv[2])
const url = `mongodb+srv://puthyrathy:${password}@cluster0.m4srr.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String, 
    number: String,
})



const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close();
    })
} else {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })
    
    person.save().then(result => {
        const responseMessage = `Added ${result.name} ${result.number} to phonebook.`
        console.log(responseMessage)
        mongoose.connection.close()
    })
}

