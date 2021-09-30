import { sendEmail } from "../models/Helper.js";

/**
 * Function will catch all errors that bubble up to it
 * @param {function} fn function from controller passed in
 * @returns none
 */
export const catchError = (fn) => (req, res, next) => {
	Promise.resolve(fn(req, res, next)).catch(async (error) => {
		console.error(error);

		// Send error to myself
		const msg = {
			to: `anthonyvidovic@gmail.com`, // list of receivers
			subject: `Error on TicketScout`, // Subject line
			text: `
			Hi Anthony, this email was automatically sent from ticketscout. There has been an error that needs to be looked at:

            ${new Date().toLocaleString}
			${error}
			${error.message}
			${error.address}
			${error.code}
			${error.dest}
			${error.errno}
			${error.info}
			${error.path}
			${error.port}
			${error.syscall}
			`,
			html: `
			Hi Anthony, this email was automatically sent from ticketscout. There has been an error that needs to be looked at:

            ${new Date().toLocaleString}
			${error}
			${error.message}
			${error.address}
			${error.code}
			${error.dest}
			${error.errno}
			${error.info}
			${error.path}
			${error.port}
			${error.syscall}
			`,
		};

		sendEmail(msg);

		res.status(500).send(
			"Error viewing resource, please try again at a later time. If the issue still persists please contact support"
		);

		// add file to display here to its nicer
	});
};
