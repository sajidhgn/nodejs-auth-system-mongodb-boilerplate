const app = require("./app");
const connectDB = require("./config/db");
const { port } = require("./config/env");

(async () => {
  await connectDB(); // Connect to MongoDB
})();

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
