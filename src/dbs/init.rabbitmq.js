'use strict'
const amqp = require('amqplib')

const connectToRabbitMQ = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost')
        if (!connection) throw new Error("Connection not established")

        const channel = await connection.createChannel()

        return {
            connection,
            channel
        }
    } catch (error) {
        console.error("Error connecting to RabbitMQ:", error)
        throw error
    }
}

const connectToRabbitMQForTest = async () => {
    try {
        const { channel, connection } = await connectToRabbitMQ()

        // Publish message to a queue
        const queue = "test-queue"
        const message = "Hello, RabbitMQ!"
        await channel.assertQueue(queue, { durable: true })
        await channel.sendToQueue(queue, Buffer.from(message))

        // Close the connection
        await channel.close()
    } catch (error) {
        console.error(`Error in RabbitMQ test:`, error)
    }
}

module.exports = {
    connectToRabbitMQ,
    connectToRabbitMQForTest
}