import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const db = process.env.MONGO_URI;
    mongoose.set("strictQuery", true);
    // mongoose.Promise = global.Promise;

    // await mongoose.connect(
    //   db,
    //   {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    //   },
    //   function (error) {
    //     if (error) {
    //       console.error(`Error: ${error.message}`);
    //       process.exit(1);
    //     }
    //   }
    // );

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // console.log(`MongoDB Connected: ${conn}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export const closeDB = async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();

    console.log(`MongoDB dropped and closed`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export const clearDB = async () => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
    }

    console.log(`MongoDB cleared `);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default { connectDB, closeDB, clearDB };
