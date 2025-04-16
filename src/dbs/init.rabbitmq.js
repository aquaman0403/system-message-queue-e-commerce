'use strict'
const amqp = require('amqplib');

const connectToRabbitMQ = async () => {
    let connection, channel;
    try {
        connection = await amqp.connect('amqp://guest:12345@localhost:5672');
        if (!connection) throw new Error("Connection not established");

        channel = await connection.createChannel();

        return {
            connection,
            channel
        };
    } catch (error) {
        console.error("Error connecting to RabbitMQ:", error.message);
        throw error;
    }
};

const connectToRabbitMQForTest = async () => {
    let connection, channel;
    try {
        const result = await connectToRabbitMQ();
        connection = result.connection;
        channel = result.channel;

        const queue = "test-queue";
        const message = "Hello, RabbitMQ!";
        await channel.assertQueue(queue, { durable: true });
        await channel.sendToQueue(queue, Buffer.from(message));

        return true;
    } catch (error) {
        console.error(`Error in RabbitMQ test:`, error.message);
        throw error;
    } finally {
        try {
            if (channel) {
                await channel.close();
                console.log('RabbitMQ channel closed');
            }
            if (connection) {
                await connection.close();
                console.log('RabbitMQ connection closed');
            }
        } catch (closeError) {
            console.error('Error during RabbitMQ cleanup:', closeError.message);
        }
    }
};

const consumerQueue = async (channel, queueName) => {
    try {
        await channel.assertQueue(queueName, { durable: true });
        console.log(`Waiting for messages in ${queueName}...`);
        channel.consume(queueName, msg => {
            console.log(`Received message: ${msg.content.toString()}`);
        }, { noAck: false });

    } catch (error) {
        console.error(`Error consuming from queue ${queueName}:`, error.message);
        throw error;
    }
}

module.exports = {
    connectToRabbitMQ,
    connectToRabbitMQForTest,
    consumerQueue
};