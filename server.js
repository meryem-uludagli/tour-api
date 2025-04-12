const app = require("./app.js");
const mongoose = require("mongoose");
require("dotenv").config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("👍🏾veritabanina baglandi");
  })
  .catch((err) => {
    console.log("👎🏾veritabanina baglanamadi");
  });

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`${port}port dinlemede🦋`);
});
