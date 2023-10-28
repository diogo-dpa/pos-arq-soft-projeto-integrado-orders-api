import amqplib from "amqplib";
import { updateTicketURLByBatchIdService } from "./orders.service";

export const listenAMQP = async () => {
	const conn = await amqplib.connect(process.env.RABBITMQ_URL ?? "");

	const queue = process.env.PROCESSED_FILES_QUEUE ?? "";

	const channel = await conn.createChannel();

	await channel.assertQueue(queue, {
		arguments: {
			"x-dead-letter-exchange": process.env.DEAD_LETTER_EXCHANGE_NAME,
		},
	});

	channel.consume(queue, async (msg: any) => {
		try {
			if (msg !== null) {
				console.log("Mensagem recebida:", msg.content.toString());
				const formattedData = JSON.parse(msg.content.toString());

				await updateTicketURLByBatchIdService(formattedData);
			} else {
				console.log("Consumidor cancelado pelo servidor.");
			}
		} catch (error) {
			console.error(`Erro ao processar arquivo: ${error}`);
		} finally {
			channel.ack(msg);
		}
	});
};
