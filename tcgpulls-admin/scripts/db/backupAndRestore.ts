#!/usr/bin/env ts-node

import "dotenv/config";
import { execSync } from "child_process";
import * as path from "path";
import serverLog from "../../utils/serverLog";

/**
 * backupAndRestore.ts
 *
 * 1) Dumps a source Postgres DB (from=...) into a file.
 * 2) Restores that dump to a target Postgres DB (to=...).
 *
 * Usage:
 *   ts-node backupAndRestore.ts \
 *     --from=postgresql://user:pass@remotehost:5432/remote_db \
 *     --to=postgresql://postgres:superpass@localhost:5432/postgres
 *
 * In this example, the --to user is "postgres" with superuser privileges,
 * and the database is just "postgres". We'll let pg_restore create the
 * actual target DB from the dump.
 */

interface PostgresConfig {
  user: string;
  password: string;
  host: string;
  port: string;
  database: string;
  sslmode?: string | null;
}

// Parse CLI arguments
const args = process.argv.slice(2);

let fromConnStr = "";
let toConnStr = "";

args.forEach((arg) => {
  if (arg.startsWith("--from=")) {
    fromConnStr = arg.replace("--from=", "").trim();
  } else if (arg.startsWith("--to=")) {
    toConnStr = arg.replace("--to=", "").trim();
  }
});

if (!fromConnStr) {
  fromConnStr = process.env.DATABASE_URL || "";
}

if (!fromConnStr) {
  serverLog(
    "error",
    "ERROR: No source DB specified. Provide --from=<connectionString> or set DATABASE_URL.",
  );
  process.exit(1);
}

if (!toConnStr) {
  serverLog(
    "error",
    "ERROR: Missing --to=<connectionString> parameter (target DB).",
  );
  process.exit(1);
}

// Helper to parse Postgres connection strings
function parsePostgresConnectionString(connStr: string): PostgresConfig {
  const url = new URL(connStr);
  const database = url.pathname.replace(/^\/+/, "") || "";
  const sslmode = url.searchParams.get("sslmode");

  return {
    user: decodeURIComponent(url.username || ""),
    password: decodeURIComponent(url.password || ""),
    host: url.hostname || "localhost",
    port: url.port || "5432",
    database,
    sslmode,
  };
}

const fromConfig = parsePostgresConnectionString(fromConnStr);
const toConfig = parsePostgresConnectionString(toConnStr);

const DUMP_FILE_PATH = path.join(__dirname, "backup.dump");

function backupDatabase(config: PostgresConfig) {
  serverLog(`>>> Backing up source database: ${config.database}`);

  const pgDumpCmd = [
    "pg_dump",
    `-h ${config.host}`,
    `-p ${config.port}`,
    `-U ${config.user}`,
    "-Fc",
    `-f ${DUMP_FILE_PATH}`,
    config.database,
  ].join(" ");

  const envVars = { ...process.env };
  if (config.password) {
    envVars.PGPASSWORD = config.password;
  }
  if (config.sslmode === "require") {
    envVars.PGSSLMODE = "require";
  }

  execSync(pgDumpCmd, { stdio: "inherit", env: envVars });
  serverLog(`>>> Backup created at: ${DUMP_FILE_PATH}`);
}

function restoreDatabase(config: PostgresConfig) {
  // Note: We connect to `config.database` in the connection string, but if you want
  // to ALWAYS restore to `postgres` (the DB name) for the superuser, you can do so.
  serverLog(`\n>>> Restoring backup into target database: ${config.database}`);

  // This is the KEY difference:
  //  - We use `--create` so pg_restore will create the target DB inside 'postgres'.
  //  - We must connect to *some* existing database (often 'postgres'), not the DB we want to create.
  //  - If your `toConfig.database` is "postgres", you might want the real DB name to come from the dump file itself.
  //    If the dump includes the CREATE DATABASE statement, it will create that automatically.
  //    Alternatively, you can manually specify the DB you want in the dump or restore steps.

  const pgRestoreCmd = [
    "pg_restore",
    `-h ${config.host}`,
    `-p ${config.port}`,
    `-U ${config.user}`, // we expect this user to be superuser
    "--clean",
    "--create", // let pg_restore create the target DB
    "--no-owner",
    "--if-exists",
    "--no-acl",
    // We'll connect to config.database, typically "postgres" in a superuser scenario.
    `-d ${config.database}`,
    DUMP_FILE_PATH,
  ].join(" ");

  const envVars = { ...process.env };
  if (config.password) {
    envVars.PGPASSWORD = config.password;
  }
  if (config.sslmode === "require") {
    envVars.PGSSLMODE = "require";
  }

  execSync(pgRestoreCmd, { stdio: "inherit", env: envVars });

  serverLog(">>> Backup successfully restored to target database!");
}

function main() {
  try {
    backupDatabase(fromConfig);
    restoreDatabase(toConfig);
    serverLog(
      "\n>>> Done! The target DB now contains data/schema from the source DB.\n",
    );
  } catch (error) {
    serverLog("error", "ERROR during backup/restore process:", error);
    process.exit(1);
  }
}

main();
