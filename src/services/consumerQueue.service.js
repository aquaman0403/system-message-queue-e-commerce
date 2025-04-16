'use strict'

const { connectToRabbitMQ, consumerQueue } = require("../dbs/init.rabbitmq")

// const log = console.log

// console.log = function () {
//     log.apply(console, [new Date()].concat(arguments))
// }

const messageService = {
    consumerQueue: async (queueName) => {
        try {
            const { channel, connection } = await connectToRabbitMQ()
            await consumerQueue(channel, queueName)
        } catch (error) {
            console.error(`Error in consumerQueue:`, error.message)
        }
    },
    // Case processing
    consumerQueueNormal: async (queueName) => {
        try {
            const { channel, connection } = await connectToRabbitMQ()
            const notiQueueName = "notificationQueueProcess" // assertQueue
            
            // 1. TTL
            // const timeExire = 15000
            // setTimeout(() => {
            //     channel.consume(notiQueueName, msg => {
            //         console.log(` [x] SEND notificationQueue successfully: ${msg.content.toString()}`)
            //         channel.ack(msg)
            //     })
            // }, timeExire)

            // 2. LOGIC
            channel.consume(notiQueueName, msg => {
                try {
                    const numberTest = Math.random()
                    console.log({ numberTest })
                    if (numberTest < 0.8) {
                        throw new Error("Send notitication failed:: HOT FIX")
                    }
                    console.log(` [x] SEND notificationQueue successfully: ${msg.content.toString()}`)
                    channel.ack(msg)
                } catch (error) {
                    // console.error(`SEND notification error:`, error.message)
                    channel.nack(msg, false, false)
                    /*
                        nack: negative acknowledgment
                        false: Đẩy vào hàng đợi bị lỗi còn nếu true thì sẽ đẩy ngược lại
                        false: Từ chối nhiều tin nhắn hay không
                    */
                }
            })
           
        } catch (error) {
            console.error(`Error in consumerQueueNormal:`, error.message)
        }
    },

    // Case failed processing
    consumerQueueFailed: async (queueName) => {
        try {
            const { channel, connection } = await connectToRabbitMQ()
            const notificationExchangeDLX = 'notificationExchangeDLX';
            const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX';
            const notiQueueHandler = "notificationQueueHotFix"

            await channel.assertExchange(notificationExchangeDLX, 'direct', { durable: true });
            
            const queueResult = await channel.assertQueue(notiQueueHandler, {
                exclusive: false,
            })

            await channel.bindQueue(queueResult.queue, notificationExchangeDLX, notificationRoutingKeyDLX)
            await channel.consume(queueResult.queue, msg => {
                console.log(` [x] This notification error, please hot fix: ${msg.content.toString()}`)
            }, {
                noAck: false
            })

        } catch (error) {
            console.error(`Error in consumerQueueFailed:`, error.message)
        }
    }
}

module.exports = messageService