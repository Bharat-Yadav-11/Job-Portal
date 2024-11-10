const { default: mongoose } = require("mongoose");

const connectToDB = async () => {
  const connectionURL = "mongodb+srv://Bharat:Bharat@22@cluster0.z62k1.mongodb.net/<database>?retryWrites=true&w=majority";

  mongoose
    .connect(connectionURL)
    .then(() => console.log("job board database connection is successfull"))
    .catch((error) => console.log(error));
};

export default connectToDB;
