import mongoose from "mongoose";

const connectionString = process.env.ATLAS_URI || "";

const initializeConfig = async () => {
	try {
		await mongoose.connect(connectionString, {
			dbName: process.env.DB_HOST_NAME,
		});
		console.log("Connected to MongoDb");
	} catch (error) {
		console.log(error);
	}
};

export default initializeConfig;
