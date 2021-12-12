const mongoose = require('mongoose')

if (process.argv.length<3){
    console.log('give password as argument')
    
}

const password = process.argv[2]

const url = `mongodb+srv://fullstackdb:${password}@cluster0.s6gsg.mongodb.net/contactsv1?retryWrites=true&w=majority`

mongoose.connect(url)



const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: Number,

})


const Contact = mongoose.model('Contact', contactSchema)

if (process.argv.length === 3) {
    Contact.find({}).then(res => {
        console.log('phonebook:')
        
        res.forEach(c => {
            console.log(`${c.name} ${c.number}`)
            
        } )
        mongoose.connection.close()
    })
    console.log()
} else {
    const newContact = new Contact({
        name: process.argv[3],
        number: process.argv[4],
        id: Math.floor(Math.random() * 12345)
    })
    
    newContact.save().then(res => {
        console.log(`added ${newContact.name} number ${newContact.number} to phonebook`)
        mongoose.connection.close()
        
    })
}

