import app from './app.js';
import { env } from './config/env.js';

const port = env.port || 3000;

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
