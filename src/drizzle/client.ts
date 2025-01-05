import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schemas from "./schemas";

export type DrizzleClient = NodePgDatabase<typeof schemas>;
