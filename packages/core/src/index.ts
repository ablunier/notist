import "dotenv/config";
import { createApp } from "./infrastructure/http/server.js";
import { buildContainer } from "./infrastructure/container.js";

const PORT = process.env.PORT ?? 3001;
const app = createApp(buildContainer());

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
