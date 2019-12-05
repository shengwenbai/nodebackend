const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]


const url =
    `mongodb+srv://adrian:${password}@adriancluster-kbye6.azure.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', contactSchema)

if (process.argv.length == 3) {
    console.log("phonebook:")
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name + " " + person.number)
        })
        mongoose.connection.close()
    })
} else if (process.argv.length != 5) {
    console.log('give name and number as arguments')
    process.exit(1)
} else {
    const name = process.argv[3]
    const number = process.argv[4]
    const person = new Person({
        name: name,
        number: number,
    })

    person.save().then(response => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}