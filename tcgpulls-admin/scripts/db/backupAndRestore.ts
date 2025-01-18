#!/usr/bin/env ts-node

/**
 * backupAndRestore.ts
 *
 * 1) Dumps a source Postgres DB (from=...) into a file.
 * 2) Restores that dump to a target Postgres DB (to=...).
 *
 * Usage:
 *   ts-node backupAndRestore.ts \
 *     --from=postgresql://user:pass@localhost:5432/my_local_db \
 *     --to=postgres://another_user:another_pass@remotehost:5432/remote_db?sslmode=require
 *
 * If --from is omitted, it falls back to process.env.DATABASE_URL.
 * The --to parameter is mandatory.
 */

import { execSync } from "child_process";
import * as path from "path";
import serverLog from "../../utils/serverLog";

// --------------------------------------------------
// 1) Parse CLI arguments
// --------------------------------------------------
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

// If --from not provided, fall back to DATABASE_URL
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

// --------------------------------------------------
// 2) Parse connection strings
// --------------------------------------------------
interface PostgresConfig {
  user: string;
  password: string;
  host: string;
  port: string;
  database: string;
  sslmode?: string | null;
}

function parsePostgresConnectionString(connStr: string): PostgresConfig {
  try {
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
  } catch (error) {
    serverLog("error", "Invalid Postgres connection string:", connStr);
    throw error;
  }
}

const fromConfig = parsePostgresConnectionString(fromConnStr);
const toConfig = parsePostgresConnectionString(toConnStr);

// --------------------------------------------------
// 3) Define backup / restore helpers
// --------------------------------------------------
const DUMP_FILE_PATH = path.join(__dirname, "backup.dump");

/**
 * backupDatabase(config)
 * Uses pg_dump with a custom format (-Fc) to create a .dump file
 */
function backupDatabase(config: PostgresConfig) {
  serverLog(`>>> Backing up source database: ${config.database}`);

  const pgDumpCmd = [
    "pg_dump",
    `-h ${config.host}`,
    `-p ${config.port}`,
    `-U ${config.user}`,
    "-Fc", // custom format
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

/**
 * restoreDatabase(config)
 * Uses pg_restore to restore the dump file to the target DB.
 * We add `--if-exists` to avoid "does not exist" errors on drop statements.
 */
function restoreDatabase(config: PostgresConfig) {
  serverLog(`\n>>> Restoring backup into target database: ${config.database}`);

  const pgRestoreCmd = [
    "pg_restore",
    `-h ${config.host}`,
    `-p ${config.port}`,
    `-U ${config.user}`,
    "--clean",
    "--no-owner",
    "--if-exists",
    "--no-acl",
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

// --------------------------------------------------
// 4) Main Execution Flow
// --------------------------------------------------
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
