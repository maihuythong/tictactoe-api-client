const mongoose = require('mongoose');

module.exports = async () => {
  try {
    const connect = await mongoose.connect(
      process.env.mongodbUrl,
      // process.env.mongodbUrlLocal,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    // const connect = await mongoose.connect(process.env.mongodbUrlLocal, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // });
    console.log('MongoDB connected');
  } catch (e) {
    console.log(e);
  }
};
