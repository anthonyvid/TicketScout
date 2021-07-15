const usersCollection = require("../db").collection("users");

module.exports = {
	isAccessGranted: (req, res, next) => {
		const jwt = require("jsonwebtoken");
		const token = localStorage.getItem("auth");
		/*
     *Route gard that protect logged in information
     *First verify jwt recieved from client
     *then get information of specific user with jwt information
     *then check if user is connected
     *then check if its the right user we are currently trying to update
          (making sure users can't update other users informations)
     *then sign new jwt with user info and update database lastACtion Column of the specific user
     *send back updated jwt to client
     *use next() to pass from routeGard to Route specific method
     */
		//verify that jwt is recieved from client
		if (token == null) return res.sendStatus(401);

		//get infomation about specific user
		jwt.verify(token, process.env.JWT_SECRET, async (err, email) => {
			if (err) return res.sendStatus(403);
			
			//find user and database, check if conncted key is true, see if email they inputted matches database
			
		});

		next();
	},
};
