import { CONFIG } from "@exness/shared";
import { Pool } from "pg";

export const pool = new Pool({
  connectionString: CONFIG.db.timeScaleUrl,
  max: 20,
});
