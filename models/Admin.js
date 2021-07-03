const User = require("./User");

class Admin extends User {
	constructor(data) {
		super();
		this.data = data;
		this.errors = [];
	}

	async inviteEmployee(data) {
		/*need to make something where you send them an email with link,
        / link will send them to the employeeRegistry.ejs file. Link needs to have storename in it,
        / this is because in User.js we need to know what store to add employee to.
        */
		// create reusable transporter object using the default SMTP transport
		const { email } = req.body;

		let transporter = nodemailer.createTransport({
			host: "smtp.ethereal.email",
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				user: "cordia35@ethereal.email", // generated ethereal user
				pass: "HvaQKaxbu5EnAZ5btT", // generated ethereal password
			},
		});

		// send mail with defined transport object
		const msg = {
			from: '"TicketScout" <TicketScout@example.com>', // sender address
			to: `${email}`, // list of receivers
			subject: "Register Your Account", // Subject line
			html: "this is a test email",
		};

		const info = await transporter.sendEmail(msg);

		console.log("Message sent: %s", info.messageId);
		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

		// Preview only available when sending through an Ethereal account
		console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
		// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
	}
}

module.exports = Admin;
