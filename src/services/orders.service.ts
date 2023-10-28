import { v4 as uuidv4 } from "uuid";
import amqplib from "amqplib";
import Order from "../models/orders.model";
import { StatusOrderEnum } from "../helpers/interfaces";
import {
	ICreateOrderService,
	IGetOrderByBatchIdService,
	IUpdateOrderByBatchIdService,
	IUpdateTicketURLByBatchIdService,
	OrderViewModel,
} from "../iservices/iorders.services";

export async function createOrderService(newOrder: ICreateOrderService) {
	const batchId = uuidv4();
	const files = newOrder.files;
	const conn = await amqplib.connect(process.env.RABBITMQ_URL ?? "");
	const filesQueue = process.env.FILES_QUEUE ?? "";
	const pubChannel = await conn.createChannel();

	for (let index = 0; index < files.length; index++) {
		const fileLink = files[index];
		pubChannel.sendToQueue(
			filesQueue,
			Buffer.from(JSON.stringify({ batch: batchId, filename: fileLink }))
		);
		await Order.create({
			batchId,
			responsible: newOrder.responsible,
			size: newOrder.size,
			lastUpdate: new Date(),
			status: StatusOrderEnum.inProgress,
			fileUrlLink: fileLink,
		});
	}
}

export async function getOrdersService(): Promise<OrderViewModel[]> {
	const orders = await Order.find();

	const distinctBatchIds = Array.from(new Set(orders.map((o) => o.batchId)));

	const mappedOrder = distinctBatchIds.map((b) => {
		const order = orders.filter((o) => o.batchId === b);
		return {
			batchId: order[0].batchId,
			responsible: order[0].responsible,
			status: order[0].status,
			size: order[0].size,
			lastUpdate: order[0].lastUpdate,
			files: order.map((f) => f.fileUrlLink),
		};
	});

	return mappedOrder;
}

export async function getOrderByBatchIdService(
	order: IGetOrderByBatchIdService
): Promise<OrderViewModel[]> {
	const existingOrder = await Order.find({
		batchId: { $eq: order.batchId },
	});

	if (!existingOrder.length) throw new Error("Order doesn't exist.");

	const mappedOrder = [
		{
			batchId: existingOrder[0].batchId,
			responsible: existingOrder[0].responsible,
			status: existingOrder[0].status,
			size: existingOrder[0].size,
			lastUpdate: existingOrder[0].lastUpdate,
			ticketURL: existingOrder[0].ticketURL,
			files: existingOrder.map((f) => f.fileUrlLink),
		},
	];

	return mappedOrder;
}

export async function updateOrderByBatchIdService(
	updatedOrder: IUpdateOrderByBatchIdService
) {
	const existingOrder = await Order.find({
		batchId: { $eq: updatedOrder.batchId },
	});

	if (!existingOrder.length) throw new Error("Order doesn't exist.");

	await Order.updateMany(
		{
			batchId: { $eq: updatedOrder.batchId },
		},
		{
			$set: {
				status: updatedOrder.status ?? existingOrder[0].status,
				responsible: updatedOrder.responsible ?? existingOrder[0].responsible,
			},
		}
	);
}

export async function updateTicketURLByBatchIdService(
	updatedOrder: IUpdateTicketURLByBatchIdService
) {
	const existingOrder = await Order.find({
		batchId: { $eq: updatedOrder.batch },
	});

	if (!existingOrder.length) throw new Error("Order doesn't exist.");

	await Order.updateMany(
		{
			batchId: { $eq: updatedOrder.batch },
		},
		{
			$set: {
				status: StatusOrderEnum.success,
				ticketURL: updatedOrder.ticketURL ?? "",
			},
		}
	);
}
