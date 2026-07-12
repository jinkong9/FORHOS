import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { defineConfig, devices } from "@playwright/test";

function resolveJavaHome() {
  if (process.env.JAVA_HOME) {
    return process.env.JAVA_HOME;
  }

  if (process.platform !== "win32") {
    return undefined;
  }

  const jdksDirectory = path.join(homedir(), ".jdks");
  if (!existsSync(jdksDirectory)) {
    return undefined;
  }

  return readdirSync(jdksDirectory)
    .filter((directory) => directory.includes("21"))
    .map((directory) => path.join(jdksDirectory, directory))
    .find((directory) => existsSync(path.join(directory, "bin", "java.exe")));
}

const backendDirectory = path.resolve(import.meta.dirname, "../FORHOS_Backend");
const javaHome = resolveJavaHome();
const backendEnvironment = Object.fromEntries(
  Object.entries({
    ...process.env,
    JAVA_HOME: javaHome,
    SPRING_PROFILES_ACTIVE: "e2e",
  }).filter((entry): entry is [string, string] => typeof entry[1] === "string"),
);

export default defineConfig({
  testDir: "./e2e-real",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report/real" }]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
  },
  webServer: [
    {
      command: process.platform === "win32" ? "gradlew.bat bootRun" : "./gradlew bootRun",
      cwd: backendDirectory,
      env: backendEnvironment,
      url: "http://127.0.0.1:8080/api/hospital",
      reuseExistingServer: false,
      timeout: 180_000,
    },
    {
      command: "npm run dev -- --host 127.0.0.1 --port 4173",
      url: "http://127.0.0.1:4173",
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
