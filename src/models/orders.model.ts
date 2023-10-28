import mongoose from "mongoose";

const ordersSchema = new mongoose.Schema({
	batchId: {
		type: String,
		required: true,
	},
	responsible: {
		type: String,
		required: true,
	},
	size: {
		type: Number,
		required: true,
	},
	lastUpdate: {
		type: Date,
		required: true,
	},
	status: {
		type: String,
		required: true,
	},
	fileUrlLink: {
		type: String,
		required: true,
	},
	ticketURL: {
		type: String,
		required: false,
	},
});

const Order = mongoose.model("Order", ordersSchema, "orders");

export default Order;
