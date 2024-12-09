import app from "../src/app";
require("dotenv").config();

const PORT = process.env.APP_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
