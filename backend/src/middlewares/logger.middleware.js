// import morgan from "morgan";
// import chalk from "chalk";
// import util from "util";
// import logger from "../utils/logger.js";

// morgan.token("req-body", (req) => util.inspect(req.body, { depth: 2 }));
// morgan.token("req-headers", (req) => util.inspect(req.headers, { depth: 1 }));
// morgan.token("req-params", (req) => util.inspect(req.params, { depth: 1 }));
// morgan.token("req-query", (req) => util.inspect(req.query, { depth: 1 }));

// const customFormat = (tokens, req, res) => {
//   const method = tokens.method(req, res);
//   const url = tokens.url(req, res);
//   const status = tokens.status(req, res);
//   const responseTime = `${tokens["response-time"](req, res)} ms`;

//   const level =
//     status >= 500 ? "error"
//     : status >= 400 ? "warn"
//     : "info";

//   const logMessage = {
//     req: {
//       method,
//       url,
//       headers: req.headers,
//       body: req.body,
//       params: req.params,
//       query: req.query,
//     },
//     res: {
//       status,
//       body: res.locals.body,
//     },
//     responseTime,
//   };

//   logger.log(level, util.inspect(logMessage, { depth: 3 }));

//   if (process.env.LOG_LEVEL === "debug") {
//     return [
//       chalk.bgBlue("REQ"), method, url,
//       chalk.green("Status:"), status,
//       chalk.yellow("ResponseTime:"), responseTime,
//       chalk.cyan("Body:"), util.inspect(res.locals.body, { depth: 1 })
//     ].join(" | ");
//   }

//   return null; // Skip console output if not in debug mode
// };

// const loggerMiddleware = morgan(customFormat, {
//   skip: () => process.env.LOG_LEVEL !== "debug"
// });

// export default loggerMiddleware;

import morgan from "morgan";
import chalk from "chalk";
import util from "util";
import dotenv from "dotenv";
dotenv.config();
const LOG_LEVEL = process.env.LOG_LEVEL || "standard";
morgan.token("req-body", (req) =>
  util.inspect(req.body, { colors: true, depth: 2 })
);
morgan.token("req-headers", (req) =>
  util.inspect(req.headers, { colors: true, depth: 1 })
);
morgan.token("req-params", (req) => util.inspect(req.params, { colors: true }));
morgan.token("req-query", (req) => util.inspect(req.query, { colors: true }));
morgan.token("res-body", (_, res) =>
  util.inspect(res.locals.body, { colors: true, depth: 2 })
);
morgan.token("req-info", (req) => {
  const user = req.user ? `UserID: ${req.user.id}` : "Unauthenticated";
  const ip = req.ip || req.connection.remoteAddress;
  const ua = req.headers["user-agent"] || "Unknown Agent";
  return util.inspect({ user, ip, userAgent: ua }, { colors: true });
});

const customFormat = (tokens, req, res) => {
  const method = chalk.cyan.bold(tokens.method(req, res));
  const url = chalk.blue(tokens.url(req, res));
  const status = tokens.status(req, res);
  const responseTime = chalk.magenta(`${tokens["response-time"](req, res)} ms`);
  const colorStatus =
    status >= 500
      ? chalk.red(status)
      : status >= 400
      ? chalk.yellow(status)
      : chalk.green(status);

  const parts = [
    chalk.bgWhite.black("REQ_NAME"),
    "::",
    method,
    chalk.bgWhite.black("REQ_URL"),
    "::",
    url,
    chalk.bgWhite.black("STATUS"),
    "::",
    colorStatus,
    chalk.bgWhite.black("RESPONSE_TIME"),
    "::",
    responseTime,
  ];

  if (["standard", "verbose", "debug"].includes(LOG_LEVEL)) {
    parts.push(
      chalk.bgWhite.black("REQ_HEADERS"),
      "::",
      tokens["req-headers"](req, res),
      chalk.bgWhite.black("REQ_BODY"),
      "::",
      tokens["req-body"](req, res)
    );
  }

  if (["verbose", "debug"].includes(LOG_LEVEL)) {
    parts.push(
      chalk.bgWhite.black("REQ_QUERY"),
      "::",
      tokens["req-query"](req, res),
      chalk.bgWhite.black("REQ_PARAMS"),
      "::",
      tokens["req-params"](req, res)
    );
  }

  if (LOG_LEVEL === "debug") {
    parts.push(
      chalk.bgWhite.black("RESPONSE_BODY"),
      "::",
      tokens["res-body"](req, res)
    );
  }

  if (["standard", "verbose", "debug"].includes(LOG_LEVEL)) {
    parts.push(chalk.bgWhite.black("INFO"), "::", tokens["req-info"](req, res));
  }

  return status > 200 && status < 499 ? "" : parts.join(" | ");
};

const loggerMiddleware = morgan(customFormat);

export default loggerMiddleware;
