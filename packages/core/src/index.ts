import "dotenv/config";
import { createApp } from "./infrastructure/http/server.js";

const PORT = process.env.PORT ?? 3001;
const app = createApp();

app.listen(PORT, () => {
  console.log(`[core] Server running on http://localhost:${PORT}`);
});
