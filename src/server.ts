import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import ordersController from "./controllers/orders.controller";
import initializeConfig from "./database/config";
import { json } from "body-parser";
import { listenAMQP } from "./services/amqp.service";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(json());

app.use("/orders", ordersController);

listenAMQP();

app.listen(PORT, async () => {
	await initializeConfig();
	console.log(`Server listening on port ${PORT}`);
});
