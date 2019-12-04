const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
  fullname: String,
  username: {
    type: String,
    unique: true,
    required: true,
    minlength: 3
  },
  passwordHash: String,
  dateOfBirth: Date,
  email: {
    String,
    unique: true,
    required: true,
  },
  location: String,
  registerDate: Date,
  lastSignedInDate: Date,
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
  ],
  comments: [{
    type: String,
  }]
})


userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

userSchema.plugin(uniqueValidator)

const User = mongoose.model('User', userSchema)

module.exports = User
