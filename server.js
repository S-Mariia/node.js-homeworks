const mongoose = require("mongoose");

const app = require("./app");

const PORT = 3000;

mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.DB_HOST)
  .then(() => {
    console.log("Database connection successful");
    app.listen(PORT);
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
