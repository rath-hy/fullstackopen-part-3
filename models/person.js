const mongoose = require('mongoose')
mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI;

console.log('Connecting to', url);

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })


const numberValidator = (number) => {
  // console.log('Number validator called!');
  const splitNumbers = number.split("-")

  if (splitNumbers.length !== 2) {
    return false
  }

  const firstPart = splitNumbers[0]
  const secondPart = splitNumbers[1]

  if (firstPart.length !== 2 || firstPart.length !== 3) {
    return false
  }

  if (typeof(parseInt(firstPart)) !== 'number' || typeof(parseInt(secondPart)) !== 'number') {
    return false
  }

  return true;
}

const personSchema = new mongoose.Schema({
    name: {
      type: String, 
      minLength: 5,
      required: true,
    },
    number: {
      type: String,
      minLength: 8,
      validate: {
        validator: numberValidator, 
        message: 'Invalid number.',
      },
      required: true,
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    //   delete returnedObject.number
    }
})

module.exports = mongoose.model('Person', personSchema)