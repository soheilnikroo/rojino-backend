import { createApp } from "./app.js";
import { config } from "./config.js";

const app = createApp();

app.listen(config.PORT, () => {
  console.log(`Rojino backend on :${config.PORT} (provider=${config.PROVIDER})`);
});
