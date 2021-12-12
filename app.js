require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Contact = require('./models/contact')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

const errorHandler = (error,req,res,next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({error: 'malformatted id'})
    }

    if (error.name === 'ValidationError') {
        return res.status(400).send({error: 'Name should be unique'})
    }

    next(error)
}

const requestLogger = (req, res, next) => {
  console.log('Method:', req.method)
  console.log('Path:  ', req.path)
  console.log('Body:  ', req.body)
  console.log('---')
  next()
}

app.use(requestLogger)

app.get('/info', (req,res) => {
    Contact.find({}).then(contacts => {
        res.send(`<a>Phonebook has contact for ${contacts.length} persons.</a><br/><a>${Date()}</a>`)
    })
})

app.get('/api/persons', (req,res) => {
    Contact.find({}).then(contacts => {
        console.log('data got from db')
        
        res.json(contacts)
    })
})

app.post('/api/persons', (req,res, next) => {
    const body = req.body
    console.log(body.name)
    
    if (body.name === '' || body.number === '') {
        return res.status(400).json({error: "content missing"})
    }

    const newContact = new Contact({
        name: body.name,
        number: body.number
    })

    newContact.save().then(c => {
        res.json(c)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res,next) => {
    Contact.findById(req.params.id)
    .then(contact => {
        if (contact) {
            
            res.json(contact)
        } else {
            res.status(404).end()
        }
    })
    .catch(error => {
        console.log(error)
        next(error)
        
    })

})

app.delete('/api/persons/:id',(req,res,next) => {
    const contactID = req.params.id
    console.log('this is the contactID', contactID)
    
    Contact.findByIdAndRemove(contactID).then(result => {
        console.log('deleted successfully')
        res.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req,res,next) => {
    const body = req.body

    const contact = {
        name: body.name,
        number: body.number
    }

    Contact.findByIdAndUpdate(req.params.id, contact, {new: true})
        .then(updatedContact => {
            res.json(updatedContact)
        })
        .catch(error => next(error))

})

const unknownEndpoint = (req,res) => {
    res.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
    
})
