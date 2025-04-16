'use strict'

const { consumerQueue, consumerQueueFailed, consumerQueueNormal } = require("./src/services/consumerQueue.service")

const queueName = "test-topic"

// consumerQueue(queueName).then(() => {
//     console.log(`Consumer started for queue: ${queueName}`)
// }).catch(error => {
//     console.error(`Error starting consumer for queue ${queueName}:`, error.message)
// })

consumerQueueNormal(queueName).then(() => {
    console.log(`consumerQueueNormal started for queue`)
}).catch(error => {
    console.error(`Error starting consumer for queue ${queueName}:`, error.message)
})

consumerQueueFailed(queueName).then(() => {
    console.log(`consumerQueueFailed started for queue`)
}).catch(error => {
    console.error(`Error starting consumer for queue ${queueName}:`, error.message)
})