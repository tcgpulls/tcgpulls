type LogType = "log" | "info" | "warn" | "error" | "debug";

const customLog = (...args: unknown[]): void => {
  const isLoggingEnabled = process.env.ENABLE_LOGGING === "true";

  if (!isLoggingEnabled) {
    return;
  }

  const logTypes: LogType[] = ["log", "info", "warn", "error", "debug"];
  let type: LogType = "log";
  let messages: unknown[];

  if (typeof args[0] === "string" && logTypes.includes(args[0] as LogType)) {
    type = args[0] as LogType;
    messages = args.slice(1);
  } else {
    messages = args;
  }

  switch (type) {
    case "log":
      console.log(...messages);
      break;
    case "info":
      console.info(...messages);
      break;
    case "warn":
      console.warn(...messages);
      break;
    case "error":
      console.error(...messages);
      break;
    case "debug":
      console.debug(...messages);
      break;
    default:
      console.log(...messages);
      break;
  }
};

export default customLog;
