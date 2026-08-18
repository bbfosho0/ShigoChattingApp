const { spawn } = require("child_process");
const path = require("path");

const npmCli = process.env.npm_execpath;
const root = path.resolve(__dirname, "..");

if (!npmCli) {
  console.error("Unable to locate npm's CLI. Start ShigoChat with `npm run dev` from the repository root.");
  process.exit(1);
}

function spawnNpm(args, cwd) {
  return spawn(process.execPath, [npmCli, ...args], {
    cwd,
    stdio: "inherit",
  });
}

const processes = [
  spawnNpm(["run", "dev"], path.join(root, "server")),
  spawnNpm(["start"], path.join(root, "client")),
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
