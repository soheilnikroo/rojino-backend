import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  PROVIDER: z.enum(["digikala", "torob", "mock"]).default("digikala"),
});

export type AppConfig = z.infer<typeof envSchema>;

export function parseConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  return envSchema.parse(env);
}

export const config = parseConfig();

export const USER_AGENT =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Rojino/1.0";

export function encodeQuery(value: string): string {
  return encodeURIComponent(value);
}
