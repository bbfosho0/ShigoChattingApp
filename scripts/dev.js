const { spawn } = require("child_process");
const path = require("path");

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const root = path.resolve(__dirname, "..");

const processes = [
  spawn(npmCommand, ["run", "dev"], {
    cwd: path.join(root, "server"),
    stdio: "inherit",
  }),
  spawn(npmCommand, ["start"], {
    cwd: path.join(root, "client"),
    stdio: "inherit",
  }),
];

let shuttingDown = false;

function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of processes) {
    if (!child.killed) child.kill();
  }

  process.exitCode = exitCode;
}

for (const child of processes) {
  child.on("error", (error) => {
    console.error("Failed to start ShigoChat development process:", error);
    shutdown(1);
  });

  child.on("exit", (code, signal) => {
    if (shuttingDown) return;
    if (signal || (typeof code === "number" && code !== 0)) {
      shutdown(typeof code === "number" ? code : 1);
    }
  });
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
