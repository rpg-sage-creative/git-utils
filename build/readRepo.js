import { parseJson } from "@rsc-utils/json-utils";
import { readdir, readFile, stat } from "node:fs";
import { join } from "node:path";
import { readBranchName } from "./readBranchName.js";
import { readCommit } from "./readCommit.js";
async function readPackageJson(repoPath) {
    return new Promise(resolve => readFile(join(repoPath, "package.json"), null, (error, buffer) => resolve(error ? undefined : parseJson(String(buffer))))).catch(() => undefined);
}
async function readBuildDate(repoPath) {
    return new Promise(resolve => stat(join(repoPath, "build"), (err, stats) => resolve(err ? undefined : { birthtimeMs: stats.birthtimeMs, ctimeMs: stats.ctimeMs }))).catch(() => undefined);
}
async function readRscUtilsPackages(rootPath) {
    const packageMap = new Map();
    const nodeModulesPath = join(rootPath, "node_modules", "@rsc-utils");
    const packagesPath = join(rootPath, "packages", "@rsc-utils");
    const utilPaths = [packagesPath, nodeModulesPath,];
    for (const utilPath of utilPaths) {
        const fileNames = await new Promise(resolve => readdir(utilPath, (err, files) => resolve(err ? [] : files))).catch(() => []);
        const utilNames = fileNames.filter(dirName => dirName !== ".");
        for (const utilName of utilNames) {
            const pkg = await readPackageJson(join(utilPath, utilName));
            if (pkg) {
                packageMap.set(pkg.name, { name: pkg.name, version: pkg.version });
            }
        }
    }
    const keys = Array.from(packageMap.keys()).sort();
    return keys.map(key => packageMap.get(key));
}
export async function readRepo(repoPath) {
    return {
        package: await readPackageJson(repoPath),
        branch: await readBranchName(repoPath),
        build: await readBuildDate(repoPath),
        commit: await readCommit(repoPath),
        rscUtils: await readRscUtilsPackages(repoPath)
    };
}
