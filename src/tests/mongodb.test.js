'use strict'

const mongoose = require('mongoose')

const connectString = 'mongodb://localhost:27017/shopDEV'

const TestSchema = new mongoose.Schema({
    name: String
})

const Test = mongoose.model('Test', TestSchema)

describe('MongoDB Connection', () => {
    let connection

    beforeAll(async () => {
        connection = await mongoose.connect(connectString)
    })

    afterAll(async () => {
        await mongoose.connection.close()
    })

    it('should connect to the database', async () => {
        expect(mongoose.connection.readyState).toBe(1)
    })

    it('should save a test document', async () => {
        const user = new Test({ name: 'Test Document' })
        await user.save()
        expect(user.isNew).toBe(false)
    })

    it('should find a document to the database', async () => {
        const user = await Test.findOne({ name: 'Test Document' })
        expect(user).toBeDefined()
    })
})