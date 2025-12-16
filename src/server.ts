import app from "./app";
import config from "./config";
import "./cron";

app.listen(config.port, () => {
  console.log(`Assignment 2 server is running on port ${config.port}`)
});