import { db } from "../db.js";
const errorsCollection = db.collection("errors");

/**
 * Function will catch all errors that bubble up to it 
 * @param {function} fn function from controller passed in
 * @returns none
 */
export const catchError = (fn) => (req, res, next) => {
	Promise.resolve(fn(req, res, next)).catch(async (error) => {
		console.error(error);

		// Add error into database for referencing later
		await errorsCollection.insertOne({
			date: new Date().toLocaleString,
			error: error,
			message: error.message,
			address: error.address,
			code: error.code,
			dest: error.dest,
			errno: error.errno,
			info: error.info,
			path: error.path,
			port: error.port,
			syscall: error.syscall,
		});

		res.status(500).send(
			"Error viewing resource, please try again at a later time. If the issue still persists please contact support"
		);

		// add file to display here to its nicer
	});
};
