import { setDefaultResultOrder } from "node:dns";
import { createApp } from "./app.js";
import { config } from "./config.js";

// Prefer IPv4 when resolving upstream hosts (e.g. api.digikala.com). On hosts
// whose DNS returns AAAA records but cannot route IPv6, Node's fetch fails with
// an opaque "fetch failed" before it ever tries the IPv4 address. Forcing IPv4
// first avoids that. Harmless where IPv6 works.
setDefaultResultOrder("ipv4first");

const app = createApp();

app.listen(config.PORT, () => {
  console.log(`Rojino backend on :${config.PORT} (provider=${config.PROVIDER})`);
});
