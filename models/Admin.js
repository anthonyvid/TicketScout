const User = require("./User");
const dotenv = require("dotenv");
var nodemailer = require("nodemailer");

class Admin extends User {
	constructor(data) {
		super();
		this.data = data;
		this.errors = [];
	}

	async inviteEmployee(data) {
		console.log("In INVITE");
		/*need to make something where you send them an email with link,
        / link will send them to the employeeRegistry.ejs file. Link needs to have storename in it,
        / this is because in User.js we need to know what store to add employee to.
        */
		// create reusable transporter object using the default SMTP transport
		const email = data.email;

		let transporter = nodemailer.createTransport({
			// host: "smtp.ethereal.email",
			// port: 587,
			// secure: false, // true for 465, false for other ports
			service: "gmail",
			auth: {
				user: process.env.GMAILUSER, // generated ethereal user
				pass: process.env.GMAILPASS, // generated ethereal password
			},
		});

		// send mail with defined transport object
		const msg = {
			from: process.env.GMAILUSER, // sender address
			to: `${email}`, // list of receivers
			subject: "Register Your Account", // Subject line
			html: { path: "./views/employeeRegisterEmailTemplate.html" },
		};

		const info = await transporter.sendMail(msg, (err, data) => {
			if (err) {
				console.log("error occured");
			} else {
				console.log("Email sent");
			}
		});
	}
}

module.exports = Admin;
