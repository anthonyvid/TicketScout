import mongoose from "mongoose";
const db = mongoose.connection;

const configMongoConnection = () => {
  console.log(process.env.CONNECTIONSTRING);
  mongoose
    .connect(process.env.CONNECTIONSTRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((response) => {
      console.log("Connected to MongoDb");
    })
    .catch((err) => {
      console.log("Mongodb is not connected: ", err);
    });
};

export { db, configMongoConnection };
