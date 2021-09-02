import Ticket from "../models/Ticket.js";
import { getStore } from "../models/Helper.js";

export const renderStoreTickets = async function (req, res) {
	const ticket = new Ticket();
	const [result, store] = await ticket.updateTicketList(req.user.storename);

	res.render("logged-in/tickets", {
		layout: "layouts/logged-in-layout",
		user: req.user,
		tickets: result,
		store: store,
	});
};

export const renderTicketProfile = async function (req, res) {
	const ticket = new Ticket();
	const result = await ticket.getTicketData(
		req.user.storename,
		req.params.ticketID
	);
	const store = await getStore(req.user.storename);

	res.render("logged-in/ticket-profile", {
		layout: "layouts/logged-in-layout",
		user: req.user,
		ticket: result,
		ticketID: req.params.ticketID,
		store: store,
	});
};

export const renderCreateNewTicket = function (req, res) {
	res.render(`logged-in/create-new-ticket`, {
		layout: "layouts/logged-in-layout",
		user: req.user,
		phone: typeof req.body.phone !== "undefined" ? req.body.phone : "",
		firstname:
			typeof req.body.firstname !== "undefined" ? req.body.firstname : "",
		lastname:
			typeof req.body.lastname !== "undefined" ? req.body.lastname : "",
	});
};

export const createNewTicket = async function (req, res) {
	const ticket = new Ticket();
	const result = await ticket.createNewTicket(req.body, req.user);
	const [ticketError, data, ticketID] = result;

	if (Object.keys(ticketError).length === 0) {
		res.redirect(`/tickets/${ticketID}`);
	} else {
		res.render("logged-in/create-new-ticket", {
			layout: "layouts/logged-in-layout",
			user: req.user,
			ticketError: Object.values(ticketError),
			firstname: data.firstname,
			lastname: data.lastname,
			phone: undefined,
			email: data.email,
			subject: data.subject,
			description: data.description,
		});
	}
};

export const updateTicketStatus = async function (req, res) {
	const ticket = new Ticket();
	const [tickets, store] = await ticket.updateTicketStatus(
		req.body.selection,
		req.body.id,
		req.body.phone,
		req.user.storename
	);

	res.json({ tickets, store });
};

export const updateTicketIssue = async function (req, res) {
	const ticket = new Ticket();
	const tickets = await ticket.updateTicketIssue(
		req.body.selection,
		req.body.id,
		req.body.phone,
		req.user.storename
	);
	res.json({ tickets });
};

export const updateTicketInfo = async function (req, res) {
	const ticket = new Ticket();
	await ticket.updateTicketInfo(req.user.storename, req.body, req.body.phone);
	res.json({});
};

export const updateTicketShippingInfo = async function (req, res) {
	const ticket = new Ticket();
	await ticket.updateTicketShippingInfo(req.body, req.user.storename);
	res.json({});
};

export const trackShipment = async function (req, res) {
	const ticket = new Ticket();
	const result = await ticket.trackShipment(
		req.body.ticketID,
		req.user.storename
	);
	console.log(result);
	res.json({ result });
};

export const sendSms = async function (req, res) {
	const ticket = new Ticket();
	const [msg, timeSent] = await ticket.sendSms(
		req.user,
		req.body.ticketID,
		req.body.toPhone,
		req.body.message
	);

	res.json({ msg: msg, user: req.user, timeSent });
};

export const receiveSms = async function (req, res) {
	const ticket = new Ticket();
	await ticket.receiveSms(req.body);
	res.status(204).send();
};
