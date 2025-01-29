const ObjectId = jest.fn().mockImplementation(() => "mockedObjectId");
const collection = jest.fn().mockReturnThis();
const findOne = jest.fn().mockResolvedValue(null);
const updateOne = jest.fn().mockResolvedValue(null);
const insertOne = jest.fn().mockResolvedValue(null);

module.exports = {
	ObjectId,
	MongoClient: {
		connect: jest.fn().mockResolvedValue({
			db: jest.fn().mockReturnValue({
				collection: jest.fn().mockReturnValue({
					findOne,
					updateOne,
					insertOne,
				}),
			}),
		}),
	},
};
