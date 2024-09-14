import { createClient } from "@supabase/supabase-js";
import { Database } from "./generated";
import dotenv from "dotenv";

dotenv.config();

export const supabase = createClient<Database>(
  "https://maigwjhtcdimlttkflad.supabase.co",
  process.env.SUPABASE_API_KEY!
);
