import express from "express";
import {
	createOrderService,
	getOrderByBatchIdService,
	getOrdersService,
	updateOrderByBatchIdService,
	updateTicketURLByBatchIdService,
} from "../services/orders.service";
import { StatusOrderEnum } from "../helpers/interfaces";

const router = express.Router();

router.post("/", async (req, res) => {
	const { responsible, size, files } = req.body;

	try {
		if (!responsible || !size || !files.length) {
			res
				.send({
					message: "Missing required fields",
				})
				.status(400);
		}

		await createOrderService({
			responsible,
			size,
			files,
		});

		res
			.send({
				message: "Success",
			})
			.status(200);
	} catch (err: any) {
		console.warn(err.message);
		res
			.send({
				message: "Internal server error",
			})
			.status(500);
	}
});

router.get("/", async (req, res) => {
	try {
		const orders = await getOrdersService();

		res.send(orders).status(200);
	} catch (err: any) {
		console.warn(err.message);
		res
			.send({
				message: "Internal server error",
			})
			.status(500);
	}
});

router.get("/:batchId", async (req, res) => {
	const { batchId } = req.params;

	try {
		if (!batchId) {
			res
				.send({
					message: "Missing required fields",
				})
				.status(400);
		}

		const orders = await getOrderByBatchIdService({
			batchId,
		});

		res.send(orders).status(200);
	} catch (err: any) {
		console.warn(err.message);
		res
			.send({
				message: "Internal server error",
			})
			.status(500);
	}
});

router.put("/:batchId", async (req, res) => {
	const { batchId } = req.params;
	const { responsible, status } = req.body;

	try {
		if (
			!batchId ||
			(!responsible && !status) ||
			(status && !Object.values(StatusOrderEnum).includes(status))
		) {
			res
				.send({
					message: "Missing required fields",
				})
				.status(400);
		}

		await updateOrderByBatchIdService({
			batchId,
			responsible,
			status,
		});

		res.send({ message: "Success" }).status(204);
	} catch (err: any) {
		console.warn(err.message);
		res
			.send({
				message: "Internal server error",
			})
			.status(500);
	}
});

router.post("/complete/:batchId", async (req, res) => {
	const { batchId } = req.params;
	const { ticketURL } = req.body;

	try {
		if (!batchId || !ticketURL) {
			res
				.send({
					message: "Missing required fields",
				})
				.status(400);
		}

		await updateTicketURLByBatchIdService({
			batch: batchId,
			ticketURL,
		});

		res.send({ message: "Success" }).status(204);
	} catch (err: any) {
		console.warn(err.message);
		res
			.send({
				message: "Internal server error",
			})
			.status(500);
	}
});

export default router;
