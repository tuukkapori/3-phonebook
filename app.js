const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')



let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "040-123456"
    },
    {
        id: 3,
        name: "Dan abramov",
        number: "040-123456"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "040-123456"
    },
]
app.use(express.static('build'))
app.use(express.json())
app.use(cors())
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req,res) => {
    res.json(persons)
})

app.get('/info', (req,res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${Date()}</p>`)
})

app.post('/api/persons', (req,res) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({error: "you must provide name and number"})
    }

    if (persons.find(person => person.name === body.name)) {
        return res.status(400).json({error: "name must be unique"})
    }

    const newPerson = {
        id: Math.floor(Math.random() * 12345),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(newPerson)
    res.status(201).json(newPerson)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    console.log(id)
    
    const person = persons.find(person => person.id === id)
    console.log(person)
    


    if(person) {
        res.json(person)
    } else {
        res.status(404).end()
    }

})

app.delete('/api/persons/:id',(req,res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id )

    if (person) {
        persons = persons.filter(person => person.id !== id)
        res.status(200).end()
    } else {
        res.status(404).end()
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
    
})
