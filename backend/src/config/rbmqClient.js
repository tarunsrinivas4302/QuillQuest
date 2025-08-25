import amqplib from 'amqplib'

let connection = null;
let channel = null;
export const rbmqClient = async () => {
    if (!connection) {
        connection = await amqplib.connect('amqp://localhost:5672');
        channel = await connection.createChannel();
    }
    return { connection, channel };
};

export const publishToQueue = async (queueName, message) => {
    const { channel } = await rbmqClient();
    await channel.assertQueue(queueName, { durable: false });
    await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
};

export const consumeFromQueue = async (queueName, callback) => {
    const { channel } = await rbmqClient();
    await channel.assertQueue(queueName, { durable: false });
    channel.consume(queueName, (msg) => {
        console.log({msg})
        callback(JSON.parse(msg.content.toString()));
        channel.ack(msg);
    }, { noAck: false });
}

export const closeConnection = async () => {
    if (channel) {
        await channel.close();
    }
    if (connection) {
        await connection.close();
    }
}

