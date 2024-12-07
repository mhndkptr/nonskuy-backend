const express = require("express");
require("dotenv").config();

const PORT = process.env.APP_PORT || 3000;
const IP = process.env.APP_IP || 3000;

const app = express();

app.listen(PORT, IP, () => {
  console.log(`Server is running on ${IP}:${PORT}`);
});
