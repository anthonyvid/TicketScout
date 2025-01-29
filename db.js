import mongoose from "mongoose";
const db = mongoose.connection;

const configMongoConnection = () => {
	mongoose
		.connect(process.env.CONNECTIONSTRING)
		.then((response) => {
			console.log("Connected to MongoDb");
		})
		.catch((err) => {
			console.log("Mongodb is not connected: ", err);
		});
};

export { db, configMongoConnection };
