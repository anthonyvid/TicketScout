import User from "../models/User.js";
import { MongoClient, ObjectId } from "mongodb";

jest.mock("mongodb");

describe("User Model", () => {
	let user;

	beforeEach(() => {
		user = new User();
	});

	test("should validate a valid user", async () => {
		const data = {
			fullname: "John Doe",
			email: "john.doe@example.com",
			password: "password123",
			passwordConfirm: "password123",
		};

		const errors = await user.validate(
			data.fullname,
			data.email,
			data.password,
			data.passwordConfirm
		);
		expect(errors).toEqual({});
	});

	test("should return error for invalid email", async () => {
		const data = {
			fullname: "John Doe",
			email: "invalid-email",
			password: "password123",
			passwordConfirm: "password123",
		};

		const errors = await user.validate(
			data.fullname,
			data.email,
			data.password,
			data.passwordConfirm
		);
		expect(errors).toHaveProperty("email", "Not a valid email");
	});

	test("should return error for password mismatch", async () => {
		const data = {
			fullname: "John Doe",
			email: "john.doe@example.com",
			password: "password123",
			passwordConfirm: "password456",
		};

		const errors = await user.validate(
			data.fullname,
			data.email,
			data.password,
			data.passwordConfirm
		);
		expect(errors).toHaveProperty(
			"passwordConfirm",
			"Passwords do not match"
		);
	});
});
